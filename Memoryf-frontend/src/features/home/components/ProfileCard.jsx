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

function ProfileCard({ memberNo, isOwner: isOwnerProp }) {
  const navigate = useNavigate();

  /* =========================
     기본 상태
  ========================= */
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState(null); // 'followers' | 'following'
  const [followListLoading, setFollowListLoading] = useState(false);
  const [followList, setFollowList] = useState([]);
  const [followKeyword, setFollowKeyword] = useState("");
  const [followPage, setFollowPage] = useState(0);
  const [followHasMore, setFollowHasMore] = useState(true);
  const [followLoadingMore, setFollowLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const followBodyRef = useRef(null);
  const followFetchSeqRef = useRef(0);

  const currentMemberNo = getMemberNoFromToken();
  const fileInputRef = useRef(null);

  const resolvedMemberNo = memberNo ?? currentMemberNo;
  const isOwner =
    typeof isOwnerProp === "boolean"
      ? isOwnerProp
      : resolvedMemberNo != null && currentMemberNo != null && resolvedMemberNo === currentMemberNo;

  /* =========================
     홈 정보 조회
  ========================= */
  useEffect(() => {
    if (!currentMemberNo) {
      navigate("/login");
      return;
    }

    if (!resolvedMemberNo) {
      setHome(null);
      setLoading(false);
      return;
    }

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeByMemberNo(resolvedMemberNo, currentMemberNo);
        setHome(homeData);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        setHome(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [currentMemberNo, navigate, resolvedMemberNo]);

  /* =========================
     핸들러
  ========================= */
  const handleEditProfile = () => {
    navigate("/settings/edit");
  };

  const handleMessage = () => {
    navigate("/messages");
  };

  const handleToggleFollow = async () => {
    if (!resolvedMemberNo || !currentMemberNo) return;
    if (resolvedMemberNo === currentMemberNo) return;
    if (followActionLoading) return;

    const currentlyFollowing = Boolean(home?.isFollowing);

    try {
      setFollowActionLoading(true);
      const result = currentlyFollowing
        ? await unfollowMember(resolvedMemberNo, currentMemberNo)
        : await followMember(resolvedMemberNo, currentMemberNo);

      if (result?.success === false) {
        alert(result?.message || "팔로우 처리에 실패했습니다.");
        return;
      }

      const nextFollowing =
        typeof result?.isFollowing === "boolean" ? result.isFollowing : !currentlyFollowing;

      setHome((prev) => {
        if (!prev) return prev;
        const prevCount = Number(prev.followerCount ?? 0);
        const nextCount = Math.max(0, prevCount + (nextFollowing ? 1 : -1));
        return {
          ...prev,
          isFollowing: nextFollowing,
          followerCount: nextCount,
        };
      });
    } catch (e) {
      console.error("팔로우 처리 실패:", e);
      alert("팔로우 처리에 실패했습니다.");
    } finally {
      setFollowActionLoading(false);
    }
  };

  const normalizeFollowList = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((u) => ({
      ...u,
      isFollowing: Boolean(u?.isFollowing ?? u?.following),
    }));
  };

  const fetchFollowPage = async ({ type, page, keyword, append, seq }) => {
    if (!resolvedMemberNo || !currentMemberNo) return;
    if (!type) return;

    const activeSeq = typeof seq === "number" ? seq : followFetchSeqRef.current;
    const size = 20;

    const result =
      type === "followers"
        ? await getFollowersList(resolvedMemberNo, currentMemberNo, { page, size, keyword })
        : await getFollowingList(resolvedMemberNo, currentMemberNo, { page, size, keyword });

    if (!result?.success) {
      throw new Error(result?.message || "목록을 불러오지 못했습니다.");
    }

    if (activeSeq !== followFetchSeqRef.current) return;

    const normalized = normalizeFollowList(result.data);
    setFollowList((prev) => (append ? [...prev, ...normalized] : normalized));
    setFollowHasMore(Boolean(result?.hasMore) && normalized.length > 0);
    setFollowPage(page);
  };

  const openFollowModal = async (type) => {
    if (!resolvedMemberNo || !currentMemberNo) return;

    setIsFollowModalOpen(true);
    setFollowModalType(type);
    setFollowList([]);
    setFollowKeyword("");
    setFollowPage(0);
    setFollowHasMore(true);
    setFollowListLoading(true);

    try {
      const seq = ++followFetchSeqRef.current;
      await fetchFollowPage({ type, page: 0, keyword: "", append: false, seq });
    } catch (e) {
      console.error("팔로우 목록 조회 실패:", e);
      alert("목록을 불러오지 못했습니다.");
    } finally {
      setFollowListLoading(false);
    }
  };

  const closeFollowModal = () => {
    setIsFollowModalOpen(false);
    setFollowModalType(null);
    setFollowList([]);
    setFollowKeyword("");
    setFollowPage(0);
    setFollowHasMore(true);
    followFetchSeqRef.current += 1;
  };

  // 검색어 변경 시 0페이지부터 재조회 (간단 debounce)
  useEffect(() => {
    if (!isFollowModalOpen || !followModalType) return;
    if (!resolvedMemberNo || !currentMemberNo) return;

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
        console.error("팔로우 목록 검색 실패:", e);
      } finally {
        setFollowListLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followKeyword, isFollowModalOpen, followModalType, resolvedMemberNo, currentMemberNo]);

  // 무한 스크롤 sentinel
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
          console.error("팔로우 목록 추가 로드 실패:", e);
        } finally {
          setFollowLoadingMore(false);
        }
      },
      { root, rootMargin: "150px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    isFollowModalOpen,
    followModalType,
    followHasMore,
    followPage,
    followKeyword,
    followListLoading,
    followLoadingMore,
  ]);

  const handleClickMemberNick = (clickedNick) => {
    if (!clickedNick) return;
    closeFollowModal();
    navigate(`/${encodeURIComponent(clickedNick)}`);
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
            u.memberNo === targetMemberNo ? { ...u, isFollowing: nextFollowing } : u
          )
        );
      } else {
        alert(result?.message || "팔로우 처리에 실패했습니다.");
      }
    } catch (e) {
      console.error("팔로우 처리 실패:", e);
      alert("팔로우 처리에 실패했습니다.");
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
      const result = await uploadProfileImage(resolvedMemberNo, file);

      if (result?.success) {
        const homeData = await getHomeByMemberNo(resolvedMemberNo, currentMemberNo);
        setHome(homeData);
        setImageTimestamp(Date.now());
        alert("프로필 이미지가 변경되었습니다.");
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* =========================
     로딩 / 예외 처리
  ========================= */
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

  /* =========================
     렌더링
  ========================= */
  const profileImageUrl = home.profileChangeName
    ? `http://localhost:8006/memoryf/profile_images/${home.profileChangeName}?t=${imageTimestamp}`
    : defaultProfileImg;

  const followModal = isFollowModalOpen ? (
    <div className="follow-modal-overlay" onClick={closeFollowModal}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal-header">
          <div className="follow-modal-title">
            {followModalType === "followers" ? "팔로워" : "팔로잉"}
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
                const nick = u.memberNick || "익명";
                const avatarUrl = u.profileChangeName
                  ? `http://localhost:8006/memoryf/profile_images/${u.profileChangeName}`
                  : defaultProfileImg;

                return (
                  <li key={u.memberNo ?? nick} className="follow-modal-item">
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
                        onClick={() => handleClickMemberNick(nick)}
                      >
                        {nick}
                      </button>
                    </div>

                    {!isMe && (
                      <button
                        type="button"
                        className={`follow-modal-follow-btn ${u.isFollowing ? "following" : ""}`}
                        onClick={() => handleToggleFollowInList(u.memberNo)}
                      >
                        {u.isFollowing ? "팔로잉" : "팔로우"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {followHasMore && !followListLoading ? (
            <div className="follow-modal-sentinel" ref={loadMoreRef}>
              {followLoadingMore ? "불러오는 중..." : ""}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

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
            style={{ display: "none" }}
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
            <div
              className="stat-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openFollowModal("followers")}
              onKeyDown={(e) => e.key === "Enter" && openFollowModal("followers")}
            >
              <strong>{home.followerCount ?? 0}</strong>
              <span>팔로워</span>
            </div>
            <div
              className="stat-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openFollowModal("following")}
              onKeyDown={(e) => e.key === "Enter" && openFollowModal("following")}
            >
              <strong>{home.followingCount ?? 0}</strong>
              <span>팔로잉</span>
            </div>
          </div>

          <div className={`actions ${isOwner ? "owner" : "other"}`}>
            {isOwner && (
              <button className="btn primary" onClick={handleEditProfile}>
                프로필 편집
              </button>
            )}

            {!isOwner && (
              <button
                className={`btn ${home?.isFollowing ? "secondary" : "primary"}`}
                onClick={handleToggleFollow}
                disabled={followActionLoading || loading || !home}
              >
                {home?.isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}

            <button className="btn secondary message-btn" onClick={handleMessage}>
              메시지 보내기
            </button>
          </div>
        </div>
      </div>

      {isFollowModalOpen && typeof document !== "undefined"
        ? createPortal(followModal, document.body)
        : null}
    </section>
  );
}

export default ProfileCard;
