import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getHomeByMemberNo, uploadProfileImage } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import defaultProfileImg from "../../../assets/images/profiles/default-profile.svg";
import "../css/ProfileCard.css";

function ProfileCard() {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);

  /* 홈 정보 조회 */
  useEffect(() => {
    if (!memberNo) return;

    const fetchHomeData = async () => {
      if (!currentMemberNo) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setHome(homeData);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        setHome(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [currentMemberNo, navigate]);

  const handleEditProfile = () => {
    navigate("/settings/edit");
  };

  const handleMessage = () => {
    navigate("/dm");
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
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploading(true);
      const result = await uploadProfileImage(currentMemberNo, file);
      
      if (result.success) {
        // 프로필 이미지 업데이트 성공 - 홈 데이터 다시 조회
        const homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        setHome(homeData);
        setImageTimestamp(Date.now()); // 캐시 무효화를 위한 타임스탬프 갱신
        alert('프로필 이미지가 변경되었습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <section className="profile-card card">
        <div className="profile-loading">로딩 중...</div>
      </section>
    );
  }

  if (!home || !home.memberNick) {
    return (
      <section className="profile-card card">
        <div className="profile-empty">아직 프로필 정보가 없어요 🌱</div>
      </section>
    );
  }

  const profileImageUrl = home.profileChangeName
    ? `http://localhost:8006/memoryf/profile_images/${home.profileChangeName}?t=${imageTimestamp}`
    : defaultProfileImg;

  const handleImageError = (e) => {
    e.target.src = defaultProfileImg;
  };

  return (
    <section className="profile-card card">
      <div className="profile-row">
        {/* 아바타 */}
        <div className="profile-avatar" onClick={handleProfileImageClick}>
          <img src={profileImageUrl} alt="profile" />
          <span className="online-dot" />
          {uploading && <div className="upload-overlay">업로드 중...</div>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* 정보 */}
        <div className="profile-content">
          <h2 className="name">{home.memberNick}</h2>
          <span className="username">@{home.memberNick}</span>

          {home.statusMsg && <p className="bio">{home.statusMsg}</p>}

          <div className="stats inline">
            <div>
              <strong>{home.feedCount ?? 0}</strong>
              <span>게시물</span>
            </div>
            <div>
              <strong>{home.followerCount || 0}</strong>
              <span>팔로워</span>
            </div>
            <div>
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
