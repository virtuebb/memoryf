import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getGuestbookList,
  createGuestbook,
  deleteGuestbook,
  toggleGuestbookLike,
} from "../api";
import { getMemberNoFromToken } from "../../../shared/lib";
import { getProfileImageUrl } from "../../../shared/api";
import "../css/Guestbook.css";

function Guestbook({ homeNo, homeOwnerMemberNo }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [guestbook, setGuestbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const observerTarget = useRef(null);
  const listRef = useRef(null);
  const ITEMS_PER_PAGE = 3;

  const currentMemberNo = getMemberNoFromToken();
  const isMyHome =
    currentMemberNo != null &&
    homeOwnerMemberNo != null &&
    currentMemberNo === homeOwnerMemberNo;

  const fetchGuestbookList = useCallback(async (pageNum = 0, append = false) => {
    if (!homeNo || isFetching) return;
    
    try {
      setIsFetching(true);
      if (!append) {
        setLoading(true);
      }
      
      const offset = pageNum * ITEMS_PER_PAGE;
      const data = await getGuestbookList(homeNo, currentMemberNo, offset, ITEMS_PER_PAGE);
      const dataArray = Array.isArray(data) ? data : [];
      
      if (append) {
        setGuestbook(prev => [...prev, ...dataArray]);
      } else {
        setGuestbook(dataArray);
      }
      
      // 더 이상 데이터가 없으면 hasMore를 false로 설정
      if (dataArray.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("방명록 조회 실패:", error);
      if (!append) {
        setGuestbook([]);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [homeNo, currentMemberNo, isFetching]);

  // 초기 로드
  useEffect(() => {
    setGuestbook([]);
    setPage(0);
    setHasMore(true);
    fetchGuestbookList(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeNo]);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchGuestbookList(nextPage, true);
        }
      },
      {
        root: listRef.current,
        threshold: 0.1,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    const currentTarget = observerTarget.current;
    const rootEl = listRef.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [hasMore, isFetching, loading, page, fetchGuestbookList]);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!currentMemberNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const result = await createGuestbook(homeNo, trimmed, currentMemberNo);
      if (result?.success) {
        setMessage("");
        // 방명록 새로고침 - 처음부터 다시 로드
        setGuestbook([]);
        setPage(0);
        setHasMore(true);
        fetchGuestbookList(0, false);
      } else {
        alert(result?.message || "방명록 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 등록 실패:", error);
      alert("방명록 등록에 실패했습니다.");
    }
  };

  const handleDelete = async (guestbookNo) => {
    if (!window.confirm("방명록을 삭제하시겠습니까?")) return;
    try {
      const result = await deleteGuestbook(homeNo, guestbookNo);
      if (result?.success) {
        // 방명록 새로고침 - 처음부터 다시 로드
        setGuestbook([]);
        setPage(0);
        setHasMore(true);
        fetchGuestbookList(0, false);
      } else {
        alert(result?.message || "방명록 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 삭제 실패:", error);
      alert("방명록 삭제에 실패했습니다.");
    }
  };

  const handleLike = async (guestbookNo) => {
    if (!currentMemberNo) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const result = await toggleGuestbookLike(homeNo, guestbookNo, currentMemberNo);
      if (result?.success) {
        // 방명록 새로고침 - 처음부터 다시 로드
        setGuestbook([]);
        setPage(0);
        setHasMore(true);
        fetchGuestbookList(0, false);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  const handleClickMemberNick = (memberNick) => {
    if (!memberNick) return;
    navigate(`/${encodeURIComponent(memberNick)}`);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const parsed = dayjs(dateString);
    if (!parsed.isValid()) return "";

    const now = dayjs();
    const isDateOnly = typeof dateString === "string" && dateString.length <= 10;

    const diffMinutes = Math.max(0, now.diff(parsed, "minute"));
    const diffHours = Math.max(0, now.diff(parsed, "hour"));
    const diffDays = Math.max(0, now.diff(parsed, "day"));

    if (isDateOnly) {
      if (diffDays === 0) {
        if (diffMinutes < 1) return "방금";
        if (diffMinutes < 60) return `${diffMinutes}분`;
        if (diffHours < 24) return `${diffHours}시간`;
        return "오늘";
      }
      if (diffDays < 7) return `${diffDays}일`;
      if (diffDays === 7) return "1주";

      const dateFormat = parsed.year() === now.year() ? "MM.DD" : "YYYY.MM.DD";
      return parsed.format(dateFormat);
    }

    if (diffMinutes < 1) return "방금";
    if (diffMinutes < 60) return `${diffMinutes}분`;
    if (diffHours < 24) return `${diffHours}시간`;

    if (diffDays < 7) return `${diffDays}일`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주`;

    const diffMonths = Math.max(0, now.diff(parsed, "month"));
    if (diffMonths < 12) return `${diffMonths}개월`;

    const diffYears = Math.max(0, now.diff(parsed, "year"));
    return `${diffYears}년`;
  };

  if (loading) {
    return (
      <section className="guestbook card">
        <div className="guestbook-loading">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="guestbook card">
      <div className="guestbook-header">
        <h3>💌 방명록 </h3>
        <span className="count">{guestbook.length}</span>
      </div>

      <div className="guestbook-form">
        <textarea
          placeholder="따뜻한 한마디를 남겨주세요…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={120}
        />
        <button onClick={handleSubmit}>등록</button>
      </div>

      <ul className="guestbook-list" ref={listRef}>
        {guestbook.map((item) => (
          <li key={item.guestbookNo ?? `${item.memberNo}-${item.createDate}`}
          >
            <div className="guestbook-item-header">
              <div className="guestbook-author">
                <div className="guestbook-author-profile">
                  {(() => {
                    const hasStory = item.hasStory;
                    const hasUnreadStory = item.hasUnreadStory;
                    const content = (
                      <>
                        {item.profileChangeName && item.status !== 'Y' ? (
                          <img
                            src={getProfileImageUrl(item.profileChangeName)}
                            alt="프로필"
                            className="guestbook-avatar-img"
                            onError={(e) => {
                              e.target.style.display = "none";
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="guestbook-avatar"
                          style={{ display: (item.profileChangeName && item.status !== 'Y') ? "none" : "flex" }}
                        >
                          👤
                        </div>
                      </>
                    );
                    return hasStory ? <div className={`story-ring-container ${hasUnreadStory ? '' : 'read'}`}>{content}</div> : content;
                  })()}
                </div>

                <div className="guestbook-author-meta">
                  <button
                    type="button"
                    className="guestbook-author-name"
                    onClick={() => item.status !== 'Y' && handleClickMemberNick(item.memberNick)}
                    style={{ cursor: item.status === 'Y' ? 'default' : 'pointer' }}
                  >
                    {item.status === 'Y' ? 'deletedUser' : item.memberNick}
                  </button>
                  <span className="guestbook-author-time">
                    {formatTimeAgo(item.createDate)}
                  </span>
                </div>
              </div>

              <div className="guestbook-actions">
                <button
                  className={`like-btn ${item.isLiked ? "liked" : ""}`}
                  onClick={() => handleLike(item.guestbookNo)}
                >
                  ❤️ {item.likeCount > 0 ? item.likeCount : ""}
                </button>

                {(currentMemberNo === item.memberNo || isMyHome) && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.guestbookNo)}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>

            <p className="guestbook-content">{item.guestbookContent}</p>
          </li>
        ))}
        
        {/* 무한 스크롤 관찰자 타겟 */}
        {hasMore && !loading && (
          <div ref={observerTarget} className="scroll-observer" style={{ height: "20px" }} />
        )}

        {/* 로딩 중 표시 (추가 페이지) */}
        {isFetching && !loading && (
          <li className="loading-more">더 불러오는 중...</li>
        )}
      </ul>
    </section>
  );
}

export default Guestbook;
