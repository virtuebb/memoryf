import { useState, useEffect } from "react";
import { sendEmailCodeApi, verifyEmailCodeApi } from "../../api";
import "../../css/EmailVerify/EmailVerify.css";

const EmailVerify = ({ placeholder = "이메일", email, onChange, onVerified }) => {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const [codeOpen, setCodeOpen] = useState(false);
  const [verifyResult, setVerifyResult] = useState("");
  // "" | "sending" | "sent" | "checking" | "success" | "fail" | "sendFail"

  // ✅ 이메일 바뀌면 인증 상태 초기화
  useEffect(() => {
    setCode("");
    setVerified(false);
    setCodeOpen(false);
    setVerifyResult("");
    if (onVerified) onVerified(false);
  }, [email]);

  const openCodeInput = async () => {
    if (!email) return;

    // ✅ 먼저 입력창 열고 "sending" 보여주기
    setCodeOpen(true);
    setVerifyResult("sending");

    const result = await sendEmailCodeApi(email);

    if (result === 1) {
      setVerifyResult("sent");
    } else {
      setVerifyResult("sendFail");
    }
  };

  const checkCode = async () => {
    if (!code) {
      setVerifyResult("");
      return;
    }

    setVerifyResult("checking");

    const result = await verifyEmailCodeApi(email, code);

    if (result === 1) {
      setVerifyResult("success");
      setVerified(true);
      if (onVerified) onVerified(true);
    } else {
      setVerifyResult("fail");
    }
  };

  return (
    <>
      <div className="email-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="email-btn"
          onClick={openCodeInput}
          disabled={verified}
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verified}
          />

          {/* 결과 멘트 */}
          {verifyResult === "" && <p className="code-ment">인증번호를 입력해주세요</p>}

          {verifyResult === "sending" && (
            <p className="code-ment">인증번호를 전송 중입니다…</p>
          )}

          {verifyResult === "sent" && <p className="code-ment">인증번호가 발송되었습니다.</p>}

          {verifyResult === "checking" && (
            <p className="code-ment">인증번호 확인 중입니다…</p>
          )}

          {verifyResult === "success" && (
            <p className="code-ment success">✔ 인증되었습니다</p>
          )}

          {verifyResult === "fail" && (
            <p className="code-ment fail">✖ 인증번호가 올바르지 않습니다</p>
          )}

          {verifyResult === "sendFail" && (
            <p className="code-ment fail">✖ 인증번호 발송에 실패했습니다</p>
          )}

          <button
            type="button"
            className="code-check-btn"
            onClick={checkCode}
            disabled={verified}
          >
            인증번호 확인
          </button>
        </div>
      )}
    </>
  );
};

export default EmailVerify;
