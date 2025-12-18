import { useState } from "react";
import "../css/EmailVerify/EmailVerify.css"

const EmailVerify = ({ placeholder = "이메일", email, onChange }) => {

  const [codeOpen, setCodeOpen] = useState(false);
  const [verifyResult, setVerifyResult] = useState(""); 
  // "" | "success" | "fail"

  const openCodeInput = () => setCodeOpen(true);

  const checkCode = () => {
    // TODO: 나중에 서버 검증
    const isSuccess = true; // 임시

    setVerifyResult(isSuccess ? "success" : "fail");
  };

  return (
    <>
      <div className="email-row">
        <input type="email" name="email" value={email} placeholder={placeholder} />
        <button
          type="button"
          className="email-btn"
          onClick={openCodeInput}
          disabled={codeOpen}
        >
          인증번호 발송
        </button>
      </div>

      {codeOpen && (
        <div className="code-row">
          <input
            type="text"
            placeholder="인증번호 6자리"
            maxLength={6}
            className="blur-in"
          />

          <button
            type="button"
            className="code-check-btn"
            onClick={checkCode}
          >
            인증번호 확인
          </button>

          {/* 결과 멘트 */}
          {verifyResult === "" && (
            <p className="code-ment">인증번호를 입력해주세요</p>
          )}

          {verifyResult === "success" && (
            <p className="code-ment success">O 인증되었습니다</p>
          )}

          {verifyResult === "fail" && (
            <p className="code-ment fail">X 인증번호가 올바르지 않습니다</p>
          )}
        </div>
      )}
    </>
  );
};

export default EmailVerify;
