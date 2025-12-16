import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ko';
import { getFeedDetail } from '../api/feedApi';
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

function FeedDetailPage({ isModal = false }) {
  const { feedNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 캐러셀 현재 이미지 인덱스

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeedDetail(feedNo);
        setFeed(data);
        setCurrentImageIndex(0); // 피드 로드 시 첫 번째 이미지로 초기화
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
    <div className={isModal ? 'feed-modal-overlay' : ''}>
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        {isModal && (
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        )}
        
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
              <div className="feed-detail-author">
                <div className="author-avatar">👤</div>
                <span className="author-nick">{feed?.memberNick || '익명'}</span>
              </div>
            </div>

            {/* 댓글 영역 */}
            <div className="feed-detail-comments">
              {/* 피드 내용 */}
              <div className="feed-detail-content-item">
                <div className="comment-author">
                  <span className="comment-author-name">{feed?.memberNick || '익명'}</span>
                </div>
                <div className="comment-text">
                  {feed?.content || '내용 없음'}
                </div>
                <div className="comment-time">
                  {feed?.createdDate 
                    ? new Date(feed.createdDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : ''}
                </div>
              </div>

              {/* 댓글 목록 (추후 구현) */}
              <div className="comments-list">
                <p className="comments-placeholder">댓글 기능은 추후 구현 예정입니다</p>
              </div>
            </div>

            {/* 하단 액션 영역 */}
            <div className="feed-detail-actions">
              <div className="feed-actions-icons">
                <button className="action-btn like-btn" aria-label="좋아요">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              
              <div className="feed-stats">
                <span className="feed-like-count">좋아요 {feed?.likeCount || 0}개</span>
              </div>

              <span className="feed-time-ago">
                {feed?.createdDate ? formatTimeAgo(feed.createdDate) : ''}
              </span>

              {/* 댓글 입력 */}
              <div className="comment-input-area">
                <input
                  type="text"
                  className="comment-input"
                  placeholder="댓글 달기..."
                  disabled
                />
                <button className="comment-submit-btn" disabled>
                  게시
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedDetailPage;

