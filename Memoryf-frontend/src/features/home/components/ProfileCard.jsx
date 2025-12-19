import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, uploadProfileImage } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import {
  followMember,
  getFollowersList,
  getFollowingList,
  unfollowMember,
} from "../../follow/api/followApi";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/ProfileCard.css";

function ProfileCard({ memberNo, isOwner }) {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState(null); // 'followers' | 'following'
  const [followListLoading, setFollowListLoading] = useState(false);
  const [followList, setFollowList] = useState([]);
  const [followKeyword, setFollowKeyword] = useState('');
  const [followPage, setFollowPage] = useState(0);
  const [followHasMore, setFollowHasMore] = useState(true);
  const [followLoadingMore, setFollowLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const followBodyRef = useRef(null);
  const followFetchSeqRef = useRef(0);

  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!currentMemberNo) {
        navigate('/login');
        return;
      }

      if (!memberNo) return;

      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(memberNo, currentMemberNo);
        setHome(homeData);
      } catch (error) {
        console.error('홈 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [currentMemberNo, memberNo, navigate]);

  const handleEditProfile = () => {
    navigate('/settings/edit');
  };

  const handleMessage = () => {
    navigate('/dm');
  };

  const openFollowModal = async (type) => {
    if (!memberNo || !currentMemberNo) return;

    setIsFollowModalOpen(true);
    setFollowModalType(type);
    setFollowList([]);
    setFollowKeyword('');
    setFollowPage(0);
    setFollowHasMore(true);
    setFollowListLoading(true);

    try {
      const seq = ++followFetchSeqRef.current;
      const result =
        type === 'followers'
          ? await getFollowersList(memberNo, currentMemberNo, { page: 0, size: 20, keyword: '' })
          : await getFollowingList(memberNo, currentMemberNo, { page: 0, size: 20, keyword: '' });

      if (result?.success) {
        if (seq !== followFetchSeqRef.current) return;
        const normalized = Array.isArray(result.data)
          ? result.data.map((u) => ({
              ...u,
              isFollowing: Boolean(u?.isFollowing ?? u?.following),
            }))
          : [];
        setFollowList(normalized);
        setFollowHasMore(Boolean(result?.hasMore) && normalized.length > 0);
      } else {
        alert(result?.message || '목록을 불러오지 못했습니다.');
      }
    } catch (e) {
      console.error('팔로우 목록 조회 실패:', e);
      alert('목록을 불러오지 못했습니다.');
    } finally {
      setFollowListLoading(false);
    }
  };

  const closeFollowModal = () => {
    setIsFollowModalOpen(false);
    setFollowModalType(null);
    setFollowList([]);
    setFollowKeyword('');
    setFollowPage(0);
    setFollowHasMore(true);
    followFetchSeqRef.current += 1;
  };

  const normalizeFollowList = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((u) => ({
      ...u,
      isFollowing: Boolean(u?.isFollowing ?? u?.following),
    }));
  };

  const fetchFollowPage = async ({ type, page, keyword, append, seq }) => {
    if (!memberNo || !currentMemberNo) return;
    if (!type) return;

    const activeSeq = typeof seq === 'number' ? seq : followFetchSeqRef.current;

    const size = 20;
    const result =
      type === 'followers'
        ? await getFollowersList(memberNo, currentMemberNo, { page, size, keyword })
        : await getFollowingList(memberNo, currentMemberNo, { page, size, keyword });

    if (!result?.success) {
      throw new Error(result?.message || '목록을 불러오지 못했습니다.');
    }

    if (activeSeq !== followFetchSeqRef.current) return;

    const normalized = normalizeFollowList(result.data);
    setFollowList((prev) => (append ? [...prev, ...normalized] : normalized));
    setFollowHasMore(Boolean(result?.hasMore) && normalized.length > 0);
    setFollowPage(page);
  };

  // 검색어(prefix) 변경 시 0페이지부터 재조회 (간단 debounce)
  useEffect(() => {
    if (!isFollowModalOpen || !followModalType) return;
    if (!memberNo || !currentMemberNo) return;

    const t = setTimeout(async () => {
      const seq = ++followFetchSeqRef.current;
      setFollowListLoading(true);
      setFollowHasMore(true);
      try {
        await fetchFollowPage({
          type: followModalType,
          page: 0,
          keyword: followKeyword.trim(),
          append: false,
          seq,
        });
      } catch (e) {
        console.error('팔로우 목록 검색 실패:', e);
      } finally {
        setFollowListLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [followKeyword]);

  // 무한 스크롤: 하단 sentinel이 보이면 다음 페이지 로드
  useEffect(() => {
    if (!isFollowModalOpen) return;
    if (!followModalType) return;
    if (!followHasMore) return;

    const node = loadMoreRef.current;
    const root = followBodyRef.current;
    if (!node || !root) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (followListLoading || followLoadingMore) return;
        if (!followHasMore) return;

        const nextPage = (followPage ?? 0) + 1;
        setFollowLoadingMore(true);
        try {
          await fetchFollowPage({
            type: followModalType,
            page: nextPage,
            keyword: followKeyword.trim(),
            append: true,
            seq: followFetchSeqRef.current,
          });
        } catch (e) {
          console.error('팔로우 목록 추가 로드 실패:', e);
        } finally {
          setFollowLoadingMore(false);
        }
      },
      { root, rootMargin: '150px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isFollowModalOpen, followModalType, followHasMore, followPage, followKeyword, followListLoading, followLoadingMore]);

  const handleClickMemberNick = (memberNick) => {
    if (!memberNick) return;
    closeFollowModal();
    navigate(`/${encodeURIComponent(memberNick)}`);
  };

  const handleToggleFollowInList = async (targetMemberNo) => {
    if (!targetMemberNo || !currentMemberNo) return;
    if (targetMemberNo === currentMemberNo) return;

    const target = followList.find((u) => u.memberNo === targetMemberNo);
    const currentlyFollowing = Boolean(target?.isFollowing);

    try {
      const result = currentlyFollowing
        ? await unfollowMember(targetMemberNo, currentMemberNo)
        : await followMember(targetMemberNo, currentMemberNo);

      if (result?.success) {
        const nextFollowing = Boolean(result.isFollowing);
        setFollowList((prev) =>
          prev.map((u) =>
            u.memberNo === targetMemberNo
              ? { ...u, isFollowing: nextFollowing }
              : u
          )
        );
      } else {
        alert(result?.message || '팔로우 처리에 실패했습니다.');
      }
    } catch (e) {
      console.error('팔로우 처리 실패:', e);
      alert('팔로우 처리에 실패했습니다.');
    }
  };

  const handleToggleFollow = async () => {
    if (!home || !memberNo || !currentMemberNo) return;
    if (isOwner) return;

    try {
      const currentlyFollowing = Boolean(home.isFollowing);
      const result = currentlyFollowing
        ? await unfollowMember(memberNo, currentMemberNo)
        : await followMember(memberNo, currentMemberNo);

      if (result?.success) {
        const nextFollowing = Boolean(result.isFollowing);
        setHome((prev) => {
          if (!prev) return prev;
          const followerCount = prev.followerCount || 0;
          const delta = nextFollowing === currentlyFollowing ? 0 : nextFollowing ? 1 : -1;
          return {
            ...prev,
            isFollowing: nextFollowing,
            followerCount: followerCount + delta,
          };
        });
      } else {
        alert(result?.message || '팔로우 처리에 실패했습니다.');
      }
    } catch (e) {
      console.error('팔로우 처리 실패:', e);
      alert('팔로우 처리에 실패했습니다.');
    }
  };

  const handleProfileImageClick = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfileImage(currentMemberNo, file);
      
      if (result.success) {
        // 프로필 이미지 업데이트 성공 - 홈 데이터 다시 조회
        const homeData = await getHomeByMemberNo(memberNo, currentMemberNo);
        setHome(homeData);
        setImageTimestamp(Date.now()); // 캐시 무효화를 위한 타임스탬프 갱신
        alert('프로필 이미지가 변경되었습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <section className="profile-card card">
        <div className="profile-loading">로딩 중...</div>
      </section>
    );
  }

  if (!home) {
    return (
      <section className="profile-card card">
        <div className="profile-error">프로필을 불러올 수 없습니다.</div>
      </section>
    );
  }

  const profileImageUrl = home.profileChangeName 
    ? `http://localhost:8006/memoryf/profile_images/${home.profileChangeName}?t=${imageTimestamp}`
    : defaultProfileImg;

  const handleImageError = (e) => {
    e.target.src = defaultProfileImg;
  };

  const followModal = isFollowModalOpen ? (
    <div className="follow-modal-overlay" onClick={closeFollowModal}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal-header">
          <div className="follow-modal-title">
            {followModalType === 'followers' ? '팔로워' : '팔로잉'}
          </div>
          <button
            type="button"
            className="follow-modal-close"
            onClick={closeFollowModal}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="follow-modal-search">
          <input
            value={followKeyword}
            onChange={(e) => setFollowKeyword(e.target.value)}
            placeholder="검색"
            className="follow-modal-search-input"
            aria-label="팔로워/팔로잉 검색"
          />
        </div>

        <div className="follow-modal-body" ref={followBodyRef}>
          {followListLoading ? (
            <div className="follow-modal-loading">로딩 중...</div>
          ) : followList.length === 0 ? (
            <div className="follow-modal-empty">목록이 없습니다.</div>
          ) : (
            <ul className="follow-modal-list">
              {followList.map((u) => {
                const isMe = u.memberNo === currentMemberNo;
                const memberNick = u.memberNick || '익명';
                const avatarUrl = u.profileChangeName
                  ? `http://localhost:8006/memoryf/profile_images/${u.profileChangeName}`
                  : defaultProfileImg;

                return (
                  <li key={u.memberNo ?? memberNick} className="follow-modal-item">
                    <div className="follow-modal-left">
                      <div className="follow-modal-avatar">
                        <img
                          src={avatarUrl}
                          alt="프로필"
                          onError={(e) => {
                            e.target.src = defaultProfileImg;
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="follow-modal-nick"
                        onClick={() => handleClickMemberNick(memberNick)}
                      >
                        {memberNick}
                      </button>
                    </div>

                    {!isMe && (
                      <button
                        type="button"
                        className={`follow-modal-follow-btn ${u.isFollowing ? 'following' : ''}`}
                        onClick={() => handleToggleFollowInList(u.memberNo)}
                      >
                        {u.isFollowing ? '팔로잉' : '팔로우'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* 무한 스크롤 sentinel */}
          {followHasMore && !followListLoading ? (
            <div className="follow-modal-sentinel" ref={loadMoreRef}>
              {followLoadingMore ? '불러오는 중...' : ''}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className="profile-card card">
      <div className="profile-row">
        
        {/* 왼쪽 : 아바타 */}
        <div className="profile-avatar" onClick={handleProfileImageClick}>
          <img 
            src={profileImageUrl} 
            alt="profile" 
            className={uploading ? 'uploading' : ''}
            onError={handleImageError}
          />
          <span className="online-dot" />
          {isOwner && uploading && <div className="upload-overlay">업로드 중...</div>}
          {isOwner && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          )}
        </div>

        {/* 오른쪽 : 정보 */}
        <div className="profile-content">
          <h2 className="name">{home.memberNick}</h2>
          <span className="username">@{home.memberNick}</span>

          {home.statusMsg && (
            <p className="bio">{home.statusMsg}</p>
          )}

          {/* 통계 */}
          <div className="stats inline">
            <div>
              <strong>{home.feedCount || 0}</strong>
              <span>게시물</span>
            </div>
            <div
              className="stat-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openFollowModal('followers')}
              onKeyDown={(e) => e.key === 'Enter' && openFollowModal('followers')}
            >
              <strong>{home.followerCount || 0}</strong>
              <span>팔로워</span>
            </div>
            <div
              className="stat-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openFollowModal('following')}
              onKeyDown={(e) => e.key === 'Enter' && openFollowModal('following')}
            >
              <strong>{home.followingCount || 0}</strong>
              <span>팔로잉</span>
            </div>
          </div>

          <div className={`actions ${isOwner ? 'owner' : 'other'}`}>
            {isOwner && (
              <button className="btn primary" onClick={handleEditProfile}>
                프로필 편집
              </button>
            )}
            {!isOwner && (
              <button
                type="button"
                className={`btn primary follow-btn ${home.isFollowing ? 'following' : ''}`}
                onClick={handleToggleFollow}
              >
                {home.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            )}
            {!isOwner && (
              <button className="btn secondary message-btn" onClick={handleMessage}>
                메시지 보내기
              </button>
            )}
          </div>
        </div>

      </div>

      {isFollowModalOpen && typeof document !== 'undefined'
        ? createPortal(followModal, document.body)
        : null}
    </section>
  );
}

export default ProfileCard;
