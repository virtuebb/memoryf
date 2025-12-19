import { useEffect, useState } from "react";
import { getGuestbookList, createGuestbook } from "../api/guestbookApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import "../css/Guestbook.css";

function Guestbook({ homeNo, homeOwnerMemberNo }) {
  const [list, setList] = useState([]);
  const [guestbookContent, setGuestbookContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loginMemberNo = getMemberNoFromToken();
  const isMyHome = loginMemberNo === homeOwnerMemberNo;

  const fetchGuestbook = async () => {
    setLoading(true);
    try {
      const data = await getGuestbookList(homeNo);
      setList(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (homeNo) fetchGuestbook();
  }, [homeNo]);

  const handleSubmit = async () => {
    if (!guestbookContent.trim()) return;

    await createGuestbook({
      homeNo,
      guestbookContent,
      memberNo: loginMemberNo,
    });

    setGuestbookContent("");
    fetchGuestbook();
  };

  if (loading) return <div>방명록 불러오는 중...</div>;

  return (
    <section className="guestbook">
      <h3>방명록 ({list.length})</h3>

      {!isMyHome && (
        <div>
          <textarea
            value={guestbookContent}
            onChange={(e) => setGuestbookContent(e.target.value)}
          />
          <button onClick={handleSubmit}>남기기</button>
        </div>
      )}

      {list.length === 0 ? (
        <p>아직 방명록이 없어요</p>
      ) : (
        list.map((g) => (
          <div key={g.guestbookNo}>
            <strong>{g.memberNick}</strong>
            <p>{g.guestbookContent}</p>
          </div>
        ))
      )}
    </section>
  );
}

export default Guestbook;
