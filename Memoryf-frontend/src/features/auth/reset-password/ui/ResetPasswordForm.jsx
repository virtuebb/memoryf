import "../../css/Find/ResetPasswordForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPwdApi } from "../../api";

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 재설정 결과 메시지 state
  const [resetMessage, setResetMessage] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();

    // 이전 메시지 초기화
    setResetMessage("");

    if (password !== passwordCheck) {
      setResetMessage("비밀번호가 일치하지 않습니다.");

      return;
    }

    try {
      // 비밀번호 찾기 성공 후 memberId를 sessionStorage에 저장
      const memberId = sessionStorage.getItem("resetMemberId");

      if (!memberId) {
        setResetMessage("잘못된 접근입니다.");
        return;
      }

      const result = await resetPwdApi(memberId, password);

      // ApiResponse: { success, message }
      if (result?.success) {
        // 세션 비우기
        sessionStorage.removeItem("resetMemberId");

        alert("비밀번호가 변경되었습니다.");
        navigate("/login");
      } else {
        setResetMessage(result?.message || "비밀번호 변경 실패");
      }
    } catch (error) {
      console.log(error);
      setResetMessage("비밀번호 변경 중 오류 발생");
    }
  };

  return (
    <form className="resetpw-form" onSubmit={resetPassword}>
      <h2 className="resetpw-title">비밀번호 재설정</h2>
      <p className="resetpw-desc">새 비밀번호를 입력해주세요.</p>

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

      {/* 결과 메시지 */}
      {resetMessage && <p className="find-result">{resetMessage}</p>}

      <button type="submit" className="resetpw-btn">
        비밀번호 변경
      </button>

      <button type="button" className="resetpw-back" onClick={() => navigate(-1)}>
        취소
      </button>
    </form>
  );
};

export default ResetPasswordForm;
