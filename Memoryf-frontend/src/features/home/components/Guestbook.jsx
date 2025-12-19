import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { 
  getGuestbookList, 
  createGuestbook, 
  deleteGuestbook, 
  toggleGuestbookLike 
} from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import "../css/Guestbook.css";

function Guestbook({ homeNo }) {
  const [message, setMessage] = useState("");
  const [guestbook, setGuestbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentMemberNo = getMemberNoFromToken();

  useEffect(() => {
    if (homeNo) {
      fetchGuestbookList();
    }
  }, [homeNo]);

  const fetchGuestbookList = async () => {
    try {
      setLoading(true);
      const data = await getGuestbookList(homeNo, currentMemberNo);
      setGuestbook(data || []);
    } catch (error) {
      console.error('방명록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    if (!currentMemberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await createGuestbook(homeNo, message.trim(), currentMemberNo);
      if (result.success) {
        setMessage("");
        fetchGuestbookList(); // 새로고침
      } else {
        alert(result.message || '방명록 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('방명록 등록 실패:', error);
      alert('방명록 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (guestbookNo) => {
    if (!window.confirm('방명록을 삭제하시겠습니까?')) return;

    try {
      const result = await deleteGuestbook(homeNo, guestbookNo);
      if (result.success) {
        fetchGuestbookList(); // 새로고침
      } else {
        alert(result.message || '방명록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('방명록 삭제 실패:', error);
      alert('방명록 삭제에 실패했습니다.');
    }
  };

  const handleLike = async (guestbookNo) => {
    if (!currentMemberNo) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await toggleGuestbookLike(homeNo, guestbookNo, currentMemberNo);
      if (result.success) {
        fetchGuestbookList(); // 새로고침
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 댓글처럼 시간 경과 표시
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const parsed = dayjs(dateString);
    if (!parsed.isValid()) return '';

    const now = dayjs();
    const isDateOnly = typeof dateString === 'string' && dateString.length <= 10; // 'YYYY-MM-DD'

    const diffMinutes = Math.max(0, now.diff(parsed, 'minute'));
    const diffHours = Math.max(0, now.diff(parsed, 'hour'));
    const diffDays = Math.max(0, now.diff(parsed, 'day'));

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

    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes}분`;
    if (diffHours < 24) return `${diffHours}시간`;

    if (diffDays < 7) return `${diffDays}일`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주`;

    const diffMonths = Math.max(0, now.diff(parsed, 'month'));
    if (diffMonths < 12) return `${diffMonths}개월`;

    const diffYears = Math.max(0, now.diff(parsed, 'year'));
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
      {/* 헤더 */}
      <div className="guestbook-header">
        <h3>💌 Guestbook</h3>
        <span className="count">{guestbook.length}</span>
      </div>

      {/* 입력 */}
      <div className="guestbook-form">
        <textarea
          placeholder="따뜻한 한마디를 남겨주세요…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={120}
        />
        <button onClick={handleSubmit}>등록</button>
      </div>

      {/* 리스트 */}
      <ul className="guestbook-list">
        {guestbook.map((item) => (
          <li key={item.guestbookNo}>
            <div className="guestbook-item-header">
              <div className="guestbook-author">
                <div className="guestbook-author-profile">
                  {item.profileChangeName ? (
                    <img
                      src={`http://localhost:8006/memoryf/profile_images/${item.profileChangeName}`}
                      alt="프로필"
                      className="guestbook-avatar-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="guestbook-avatar" style={{ display: item.profileChangeName ? 'none' : 'flex' }}>
                    👤
                  </div>
                </div>
                <div className="guestbook-author-meta">
                  <span className="guestbook-author-name">{item.memberNick}</span>
                  <span className="guestbook-author-time">{formatTimeAgo(item.createDate)}</span>
                </div>
              </div>
              <div className="guestbook-actions">
                <button
                  className={`like-btn ${item.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(item.guestbookNo)}
                >
                  ❤️ {item.likeCount > 0 && item.likeCount}
                </button>
                {currentMemberNo === item.memberNo && (
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
      </ul>
    </section>
  );
}

export default Guestbook;
