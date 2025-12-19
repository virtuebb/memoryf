import { useEffect, useState } from "react";
import { getGuestbookList, createGuestbook } from "../api/guestbookApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import "../css/Guestbook.css";

function Guestbook({ homeNo, homeOwnerMemberNo }) {
  const [list, setList] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loginMemberNo = getMemberNoFromToken();
  const isMyHome = loginMemberNo === homeOwnerMemberNo;

  const fetchGuestbook = async () => {
    try {
      setLoading(true);
      const data = await getGuestbookList(homeNo);
      setList(data || []);
    } catch (e) {
      console.error("방명록 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (homeNo) fetchGuestbook();
  }, [homeNo]);

  return <div>...</div>;
}

export default Guestbook;
