import "../../css/Find/FindIdForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerify from "../../email-verify";
import { findIdApi } from "../../api";

const FindIdForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // 아이디 찾기 결과 state
  const [findResult, setFindResult] = useState(null);

  // 찾기 결과 메시지 state
  const [findMessage, setFindMessage] = useState("");

  // 아이디 찾기
  const findId = async (e) => {
    e.preventDefault();

    // 이전 메시지 초기화
    setFindMessage("");

    if (!emailVerified) {
      setFindResult({ success: false, message: "이메일 인증이 필요합니다." });
      setFindMessage("이메일 인증이 필요합니다.");
      return;
    }

    try {
      const result = await findIdApi(name, email);

      // ApiResponse: { success, message, data: { memberId } }
      if (result?.success && result.data?.memberId) {
        setFindResult({ success: true, memberId: result.data.memberId });
        setFindMessage(`회원님 아이디는 ${result.data.memberId} 입니다.`);
      } else {
        setFindResult({
          success: false,
          message: result?.message || "일치하는 회원이 없습니다.",
        });
        setFindMessage(result?.message || "일치하는 회원이 없습니다.");
      }
    } catch (error) {
      console.log(error);
      setFindResult({ success: false, message: "아이디 찾기 실패" });
      setFindMessage("아이디 찾기 실패");
    }
  };

  return (
    <form className="findid-form" onSubmit={findId}>
      <h2 className="findid-title">아이디 찾기</h2>
      <p className="findid-desc">가입 시 입력한 이름과 이메일을 입력하세요.</p>

      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 이메일 */}
      <EmailVerify
        email={email}
        onChange={(e) => setEmail(e.target.value)}
        onVerified={(ok) => setEmailVerified(ok)}
      />

      {/* 아이디 찾기 결과 메시지 */}
      {findMessage && <p className="find-result">{findMessage}</p>}

      <button type="submit" className="findid-btn">
        아이디 찾기
      </button>

      <button type="button" className="findid-back" onClick={() => navigate(-1)}>
        뒤로가기
      </button>
    </form>
  );
};

export default FindIdForm;
