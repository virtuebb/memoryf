import { useState, useEffect } from "react";
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\. /g, '.').replace(/\.$/, '');
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
              <div className="meta">
                <span className="name">{item.memberNick}</span>
                <span className="date">{formatDate(item.createDate)}</span>
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
            <p>{item.guestbookContent}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Guestbook;
