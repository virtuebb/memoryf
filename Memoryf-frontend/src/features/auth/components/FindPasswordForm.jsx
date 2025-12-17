import "../css/Find/FindPasswordForm.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailVerify from "./EmailVerify";

const FindPasswordForm = () => {

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

    const findPassword = (e) => {
    e.preventDefault();

    // TODO: 이메일 인증 성공 여부 체크
    navigate("/reset-password");
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
      <EmailVerify />

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
