import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ko';
import { 
  getFeedDetail, 
  deleteFeed, 
  likeFeed, 
  toggleFeedBookmark, 
  getComments, 
  createComment, 
  deleteComment, 
  toggleCommentLike 
} from '../api/feedApi';
import { getMemberNoFromToken } from '../../../utils/jwt';
import { getHomeByMemberNo } from '../../home/api/homeApi';
import { followMember, unfollowMember } from '../../follow/api/followApi';
import './FeedDetailPage.css';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale('ko');

// "전" 제거한 상대 시간 포맷 (인스타 스타일)
dayjs.updateLocale('ko', {
  relativeTime: {
    future: '%s',     // 나중에 ~ (사용 안 함)
    past: '%s',       // "~ 전" 대신 그대로 표시
    s: '방금',        // seconds
    m: '1분',
    mm: '%d분',
    h: '1시간',
    hh: '%d시간',
    d: '1일',
    dd: '%d일',
    M: '1개월',
    MM: '%d개월',
    y: '1년',
    yy: '%d년',
  },
});

function FeedDetailPage({ isModal = false, onEditFeed }) {
  const { feedNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 캐러셀 현재 이미지 인덱스
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [newComment, setNewComment] = useState(''); // 신규 댓글 입력값
  const [isMoreOpen, setIsMoreOpen] = useState(false); // 설정(점점점) 모달
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 상태
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeedDetail(feedNo);
        setFeed(data);
        // 백엔드 직렬화에 따라 isLiked가 liked로 내려올 수 있어 둘 다 처리
        setIsLiked(Boolean(data?.isLiked ?? data?.liked));
        setLikeCount(data.likeCount || 0);
        // 백엔드 직렬화에 따라 isBookmarked가 bookmarked로 내려올 수 있어 둘 다 처리
        setIsBookmarked(Boolean(data?.isBookmarked ?? data?.bookmarked));
        setCurrentImageIndex(0); // 피드 로드 시 첫 번째 이미지로 초기화
        
        // 댓글 목록 로드
        const commentsData = await getComments(feedNo);
        setComments(commentsData || []);

    // 작성자 팔로우 상태 로드(본인 피드가 아니면)
    try {
      const me = getMemberNoFromToken();
      if (me && data?.memberNo && data.memberNo !== me) {
        const homeData = await getHomeByMemberNo(data.memberNo, me);
        setIsFollowingAuthor(Boolean(homeData?.isFollowing ?? homeData?.following));
      } else {
        setIsFollowingAuthor(false);
      }
    } catch (e) {
      console.error('작성자 팔로우 상태 조회 실패:', e);
      setIsFollowingAuthor(false);
    }
      } catch (err) {
        console.error('피드 상세 조회 오류:', err);
        setError('피드를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (feedNo) {
      fetchFeed();
    }
  }, [feedNo]);

  // 피드 수정/삭제 후 상세 페이지 갱신
  useEffect(() => {
    const handleFeedChanged = async () => {
      if (feedNo) {
        try {
          const data = await getFeedDetail(feedNo);
          setFeed(data);
          // 좋아요와 북마크 상태도 함께 갱신
          setIsLiked(Boolean(data?.isLiked ?? data?.liked));
          setLikeCount(data.likeCount || 0);
          setIsBookmarked(Boolean(data?.isBookmarked ?? data?.bookmarked));
        } catch (err) {
          console.error('피드 갱신 오류:', err);
        }
      }
    };

    window.addEventListener('feedChanged', handleFeedChanged);
    return () => {
      window.removeEventListener('feedChanged', handleFeedChanged);
    };
  }, [feedNo]);

  const isOwner = (() => {
    const me = getMemberNoFromToken();
    return me && feed?.memberNo === me;
  })();

  const handleToggleFollowAuthor = async () => {
    const me = getMemberNoFromToken();
    const targetMemberNo = feed?.memberNo;
    if (!me || !targetMemberNo || me === targetMemberNo) return;

    try {
      const result = isFollowingAuthor
        ? await unfollowMember(targetMemberNo, me)
        : await followMember(targetMemberNo, me);

      if (result?.success) {
        setIsFollowingAuthor(Boolean(result.isFollowing));
      } else {
        alert(result?.message || '팔로우 처리에 실패했습니다.');
      }
    } catch (e) {
      console.error('팔로우 처리 실패:', e);
      alert('팔로우 처리에 실패했습니다.');
    }
  };

  // 인스타그램 스타일 시간 경과 표시
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const parsed = dayjs(dateString);
    if (!parsed.isValid()) return '';

    const now = dayjs();
    const isDateOnly = typeof dateString === 'string' && dateString.length <= 10; // 'YYYY-MM-DD' 형태

    const diffMinutes = Math.max(0, now.diff(parsed, 'minute'));
    const diffHours = Math.max(0, now.diff(parsed, 'hour'));
    const diffDays = Math.max(0, now.diff(parsed, 'day'));

    // 날짜만 넘어오는 경우(시분초 정보 없음)
    // - 오늘: 시간/분 단위까지 표시
    // - 그 외: 일/주/날짜 포맷
    if (isDateOnly) {
      if (diffDays === 0) {
        if (diffMinutes < 1) return '방금';
        if (diffMinutes < 60) return `${diffMinutes}분`;
        if (diffHours < 24) return `${diffHours}시간`;
        return '오늘';
      }

      if (diffDays < 7) return `${diffDays}일`;
      if (diffDays === 7) return '1주';

      const dateFormat = parsed.year() === now.year() ? 'MM.DD' : 'YYYY.MM.DD';
      return parsed.format(dateFormat);
    }

    // 1분 미만
    if (diffMinutes < 1) return '방금';
    // 1시간 미만
    if (diffMinutes < 60) return `${diffMinutes}분`;
    // 24시간 미만
    if (diffHours < 24) return `${diffHours}시간`;
    // 7일 미만
    if (diffDays < 7) return `${diffDays}일`;
    // 정확히 7일
    if (diffDays === 7) return '1주';
    // 7일 초과: 올해면 연도 생략, 작년 이전이면 연도 표시
    const dateFormat = parsed.year() === now.year() ? 'MM.DD' : 'YYYY.MM.DD';
    return parsed.format(dateFormat);
  };

  // 이미지 URL 가져오기
  const getImageUrl = (filePath) => {
    if (!filePath) return '';
    
    // 절대 URL이면 그대로 사용
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // 상대 경로면 백엔드 서버 URL과 결합
    if (filePath.startsWith('/')) {
      return `http://localhost:8006/memoryf${filePath}`;
    }
    
    return filePath;
  };


  // 캐러셀 이전 이미지
  const handlePrevImage = () => {
    if (!feed?.feedFiles || feed.feedFiles.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : feed.feedFiles.length - 1
    );
  };

  // 캐러셀 다음 이미지
  const handleNextImage = () => {
    if (!feed?.feedFiles || feed.feedFiles.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev < feed.feedFiles.length - 1 ? prev + 1 : 0
    );
  };

  const handleClose = () => {
    if (isModal) {
      navigate(-1);
    }
  };

  // 모달 바깥 클릭 시 닫기 (인스타 스타일)
  const handleOverlayClick = (e) => {
    if (!isModal) return;
    if (e.target.classList.contains('feed-modal-overlay')) {
      handleClose();
    }
  };

  // 인스타그램 스타일 텍스트 + 해시태그 렌더링
  const renderTextWithTags = (text) => {
    if (!text) return null;

    // 공백을 포함해서 그대로 유지하기 위해 캡쳐 그룹 사용
    const parts = text.split(/(\s+)/);

    return parts.map((part, index) => {
      // 공백만 있는 부분은 그대로 반환
      if (/^\s+$/.test(part)) {
        return part;
      }
      // 해시태그(#으로 시작하는 연속 문자열)
      if (/^#\S+/.test(part)) {
        return (
          <span key={index} className="inline-tag">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 댓글 등록
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    const memberNo = getMemberNoFromToken();
    if (!memberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await createComment(feedNo, trimmed, memberNo);
      if (result.success) {
        // 댓글 목록 새로고침
        const commentsData = await getComments(feedNo);
        setComments(commentsData || []);
        setNewComment('');
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // 피드 좋아요 토글
  const handleToggleLike = async () => {
    const memberNo = getMemberNoFromToken();
    if (!memberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await likeFeed(feedNo, memberNo);
      if (result.success) {
        setIsLiked(result.isLiked);
        setLikeCount((prev) => (result.isLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 피드 북마크 토글
  const handleToggleBookmark = async () => {
    const memberNo = getMemberNoFromToken();
    if (!memberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await toggleFeedBookmark(feedNo, memberNo);
      if (result.success) {
        setIsBookmarked(result.isBookmarked);
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error);
    }
  };

  // 댓글 좋아요 토글
  const handleToggleCommentLike = async (commentNo) => {
    const memberNo = getMemberNoFromToken();
    if (!memberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await toggleCommentLike(feedNo, commentNo, memberNo);
      if (result.success) {
        // 댓글 목록 새로고침
        const commentsData = await getComments(feedNo);
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error('댓글 좋아요 처리 실패:', error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentNo) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const result = await deleteComment(feedNo, commentNo);
      if (result.success) {
        // 댓글 목록 새로고침
        const commentsData = await getComments(feedNo);
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        <div className="error">{error || '피드를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  const feedFiles = feed?.feedFiles || [];
  const hasMultipleImages = feedFiles.length > 1;

  return (
    <div
      className={isModal ? 'feed-modal-overlay' : ''}
      onClick={handleOverlayClick}
    >
      <div
        className={`feed-detail-page ${isModal ? 'modal' : ''}`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <div className="feed-detail-container">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="feed-detail-image-section">
            {feedFiles.length > 0 ? (
              <div className="feed-image-carousel">
                {/* 이전 버튼 */}
                {hasMultipleImages && (
                  <button
                    className="carousel-btn carousel-btn-prev"
                    onClick={handlePrevImage}
                    aria-label="이전 이미지"
                  >
                    ‹
                  </button>
                )}
                
                {/* 현재 이미지 */}
                <div className="carousel-image-wrapper">
                  <img 
                    src={getImageUrl(feedFiles[currentImageIndex]?.filePath)} 
                    alt={feed.content || `피드 이미지 ${currentImageIndex + 1}`}
                    className="carousel-image"
                  />
                </div>
                
                {/* 다음 버튼 */}
                {hasMultipleImages && (
                  <button
                    className="carousel-btn carousel-btn-next"
                    onClick={handleNextImage}
                    aria-label="다음 이미지"
                  >
                    ›
                  </button>
                )}
                
                {/* 이미지 인디케이터 */}
                {hasMultipleImages && (
                  <div className="carousel-indicators">
                    {feedFiles.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`이미지 ${index + 1}로 이동`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="feed-no-image">
                <p>이미지가 없습니다</p>
              </div>
            )}
          </div>

          {/* 오른쪽: 댓글 및 정보 */}
          <div className="feed-detail-content-section">
            {/* 헤더 */}
            <div className="feed-detail-header">
              <div className="feed-detail-author-row">
                <div 
                  className="feed-detail-author clickable"
                  onClick={() => feed?.memberNick && navigate(`/${encodeURIComponent(feed.memberNick)}`)}
                >
                  {feed?.profileImage ? (
                    <img 
                      src={`http://localhost:8006/memoryf/profile_images/${feed.profileImage}`}
                      alt="프로필"
                      className="author-avatar-img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div className="author-avatar" style={{ display: feed?.profileImage ? 'none' : 'flex' }}>👤</div>
                  <span className="author-nick">{feed?.memberNick || '익명'}</span>
                </div>

                {!isOwner && (
                  <button
                    type="button"
                    className="follow-text-btn"
                    onClick={handleToggleFollowAuthor}
                  >
                    {isFollowingAuthor ? '팔로잉' : '팔로우'}
                  </button>
                )}
              </div>
              {isModal && (
                <button
                  className="feed-header-menu-btn"
                  aria-label="더보기"
                  type="button"
                  onClick={() => setIsMoreOpen(true)}
                >
                  ⋯
                </button>
              )}
            </div>

            {/* 댓글 영역 */}
            <div className="feed-detail-comments">
              {/* 피드 내용 */}
              <div className="feed-detail-content-item">
                <div 
                  className="comment-author-profile clickable"
                  onClick={() => feed?.memberNick && navigate(`/${encodeURIComponent(feed.memberNick)}`)}
                >
                  {feed?.profileImage ? (
                    <img 
                      src={`http://localhost:8006/memoryf/profile_images/${feed.profileImage}`}
                      alt="프로필"
                      className="comment-avatar-img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div className="comment-avatar" style={{ display: feed?.profileImage ? 'none' : 'flex' }}>👤</div>
                </div>
                <div className="comment-content-wrapper">
                  <div className="feed-main-text">
                    <span 
                      className="comment-author-name clickable"
                      onClick={() => feed?.memberNick && navigate(`/${encodeURIComponent(feed.memberNick)}`)}
                    >
                      {feed?.memberNick || '익명'}
                    </span>
                    <span className="comment-text-inline">
                      {feed?.content ? renderTextWithTags(feed.content) : ''}
                    </span>
                  </div>
                  <div className="comment-time">
                    {feed?.createdDate ? formatTimeAgo(feed.createdDate) : ''}
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <div className="comments-placeholder">
                    <p className="no-comments-bold">아직 댓글이 없습니다</p>
                    <p className="no-comments-sub">댓글을 남겨주세요</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.commentNo} className="feed-detail-content-item comment-item">
                      <div 
                        className="comment-author-profile clickable"
                        onClick={() => comment?.writerNick && navigate(`/${encodeURIComponent(comment.writerNick)}`)}
                      >
                        {comment.writerProfileImage ? (
                          <img 
                            src={`http://localhost:8006/memoryf/profile_images/${comment.writerProfileImage}`}
                            alt="프로필"
                            className="comment-avatar-img"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div className="comment-avatar" style={{ display: comment.writerProfileImage ? 'none' : 'flex' }}>👤</div>
                      </div>
                      <div className="comment-content-wrapper">
                        <div className="feed-main-text">
                          <span 
                            className="comment-author-name clickable"
                            onClick={() => comment?.writerNick && navigate(`/${encodeURIComponent(comment.writerNick)}`)}
                          >
                            {comment.writerNick}
                          </span>
                          <span className="comment-text-inline">
                            {renderTextWithTags(comment.content)}
                          </span>
                        </div>
                        <div className="comment-actions">
                          <span className="comment-time">
                            {comment.createDate
                              ? formatTimeAgo(comment.createDate)
                              : ''}
                          </span>
                          {comment.likeCount > 0 && (
                            <span className="comment-likes">
                              좋아요 {comment.likeCount}개
                            </span>
                          )}
                          {getMemberNoFromToken() === comment.writer && (
                            <button
                              className="comment-delete-btn"
                              onClick={() => handleDeleteComment(comment.commentNo)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        className={`comment-like-btn ${Boolean(comment?.isLiked ?? comment?.liked) ? 'liked' : ''}`}
                        onClick={() => handleToggleCommentLike(comment.commentNo)}
                        aria-label="댓글 좋아요"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 하단 액션 영역 */}
            <div className="feed-detail-actions">
              <div className="feed-actions-row">
                <div className="feed-actions-icons">
                  <button 
                    className={`action-btn like-btn ${isLiked ? 'liked' : ''}`} 
                    aria-label="좋아요"
                    onClick={handleToggleLike}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#ed4956' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <button className="action-btn comment-btn" aria-label="댓글">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                  <button className="action-btn share-btn" aria-label="공유">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div>
                <button
                  className={`action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  aria-label="북마크"
                  onClick={handleToggleBookmark}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="feed-stats">
                <span className="feed-like-count">좋아요 {likeCount}개</span>
                {likeCount === 0 && (
                  <p className="first-like-text">가장 먼저 좋아요를 눌러보세요</p>
                )}
              </div>

              <span className="feed-time-ago">
                {feed?.createdDate ? formatTimeAgo(feed.createdDate) : ''}
              </span>

              {/* 댓글 입력 */}
              <form className="comment-input-area" onSubmit={handleSubmitComment}>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="댓글 달기..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={!newComment.trim()}
                >
                  게시
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 설정(점점점) 모달 - 인스타그램 스타일 액션 시트 */}
        {isMoreOpen && (
          <div
            className="more-menu-overlay"
            onClick={() => setIsMoreOpen(false)}
          >
            <div
              className="more-menu-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {isOwner ? (
                <>
                  <button
                    type="button"
                    className="more-menu-item more-menu-danger"
                    onClick={async () => {
                      if (!window.confirm('이 피드를 삭제하시겠습니까?')) return;
                      try {
                        const res = await deleteFeed(feed.feedNo);
                        if (res?.success) {
                          alert('삭제되었습니다.');
                          // 피드 목록 새로고침을 위해 전역 이벤트 발행
                          window.dispatchEvent(new Event('feedChanged'));
                          setIsMoreOpen(false);
                          navigate('/feeds');
                        } else {
                          alert(res?.message || '삭제에 실패했습니다.');
                        }
                      } catch (err) {
                        alert('삭제 중 오류가 발생했습니다.');
                      }
                    }}
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    className="more-menu-item"
                    onClick={() => {
                      setIsMoreOpen(false);
                      if (onEditFeed) {
                        onEditFeed(feed);
                        handleClose(); // 상세 모달 닫기
                      }
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="more-menu-item"
                    onClick={() => {
                      const url = `${window.location.origin}/feeds/${feed.feedNo}`;
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(url).catch(() => {});
                      }
                      setIsMoreOpen(false);
                    }}
                  >
                    링크 복사
                  </button>
                  <button
                    type="button"
                    className="more-menu-item more-menu-cancel"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="more-menu-item more-menu-danger"
                  >
                    신고
                  </button>
                  <button
                    type="button"
                    className="more-menu-item"
                    onClick={() => {
                      const url = `${window.location.origin}/feeds/${feed.feedNo}`;
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(url).catch(() => {});
                      }
                      setIsMoreOpen(false);
                    }}
                  >
                    링크 복사
                  </button>
                  <button
                    type="button"
                    className="more-menu-item more-menu-cancel"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FeedDetailPage;

