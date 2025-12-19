import "../css/Find/FindPasswordForm.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailVerify from "./EmailVerify";
import findPwdApi from "../api/findPwdApi";

const FindPasswordForm = () => {

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // 비밀번호 찾기 결과 메시지 state
  const [findMessage, setFindMessage] = useState("");

    const findPassword = async(e) => {

      e.preventDefault();

      // 메시지 초기화
      setFindMessage("");

      if(!emailVerified) {

        setFindMessage("이메일 인증이 필요합니다.");

        return;
      }

      try {

        const response = await findPwdApi(userId, email);

        // 백엔드 boolean 반환
        if(response.data === true) {

          // 아이디 저장 -> 비밀번호 변경 시 사용
          sessionStorage.setItem("resetMemberId", userId);

          navigate("/reset-password");

        } else {

          setFindMessage("아이디 또는 이메일이 일치하지 않습니다.");
        }

      } catch(error) {

        console.log(error);
        setFindMessage("비밀번호 찾기 실패");
      }
    };

  return (
    <form className="findpw-form" onSubmit={findPassword}>

      <h2 className="findpw-title">비밀번호 찾기</h2>
      <p className="findpw-desc">
        아이디와 가입 시 등록한 이메일을 입력하세요.
      </p>

      <input
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* ✅ 이메일 인증 공통 컴포넌트 */}
      <EmailVerify email={email} onChange={(e) => setEmail(e.target.value)} onVerified={(ok) => setEmailVerified(ok)} />

      {/* 결과 메시지 */}
      {findMessage && (<p className="find-result">{findMessage}</p>)}

      <button type="submit" className="findpw-btn">
        비밀번호 재설정
      </button>

      <button
        type="button"
        className="findpw-back"
        onClick={() => navigate(-1)}
      >
        뒤로가기
      </button>

    </form>
  )
}

export default FindPasswordForm
