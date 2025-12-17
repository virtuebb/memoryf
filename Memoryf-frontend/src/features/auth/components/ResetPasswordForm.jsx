import "../css/Find/ResetPasswordForm.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ResetPasswordForm = () => {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const resetPassword = (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 백엔드 비밀번호 재설정 처리
    alert("비밀번호가 변경되었습니다.");
    navigate("/login");
  };

  return (
    <form className="resetpw-form" onSubmit={resetPassword}>

      <h2 className="resetpw-title">비밀번호 재설정</h2>
      <p className="resetpw-desc">
        새 비밀번호를 입력해주세요.
      </p>

      <input
        type="password"
        placeholder="새 비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />

      <button type="submit" className="resetpw-btn">
        비밀번호 변경
      </button>

      <button
        type="button"
        className="resetpw-back"
        onClick={() => navigate(-1)}
      >
        취소
      </button>

    </form>
  )
}

export default ResetPasswordForm
