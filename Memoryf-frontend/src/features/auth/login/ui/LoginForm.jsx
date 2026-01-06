import "../../css/Login/LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { loginMemberApi } from "../../api";
import { useState, useEffect } from "react";
import { getAssetUrl } from "../../../../shared/api";

// ✅ DM에서 사용하는 디코딩 함수를 그대로 가져오거나 정의합니다.
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error("JWT 토큰 디코딩 실패:", e);
    return null;
  }
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    const idSave = localStorage.getItem("saveId");
    if (idSave) {
      setMemberId(idSave);
      setSaveId(true);
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      // 1. 서버에 로그인 요청 (결과값은 { token: JWT } 객체)
      const res = await loginMemberApi(memberId, memberPwd);
      console.log("서버 응답:", res);

      // 2. 응답에서 토큰 추출 (객체 또는 문자열 모두 처리)
      const token = res?.token || (typeof res === "string" ? res : null);

      if (token) {
        // 토큰 저장 (DM 등 기존 기능용)
        localStorage.setItem("accessToken", token);

        // 3. 토큰 디코딩하여 유저 정보 추출 (스토리 기능용)
        const decoded = decodeToken(token);
        console.log("디코딩된 유저 정보:", decoded);

        if (decoded) {
          // ★ 주의: decoded 내부의 키 이름이 memberNo인지 확인 필요 (DM 쪽 코드 참고)
          const loginMember = {
            memberNo: decoded.memberNo || decoded.no || decoded.userNo,
            memberId: decoded.sub || decoded.memberId,
          };

          // 스토리 로직에서 사용하는 loginMember 저장
          localStorage.setItem("loginMember", JSON.stringify(loginMember));

          console.log("로그인 성공 및 유저 정보 저장 완료");
          
          // 인증 상태 변경 이벤트 발생 (AppRouter가 리렌더링되도록)
          window.dispatchEvent(new Event("authStateChanged"));
          
          // 홈으로 이동 (강제 새로고침으로 상태 초기화)
          window.location.href = "/home";
        } else {
          alert("유효하지 않은 인증 정보입니다.");
        }
      } else {
        alert("로그인 정보가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("로그인 중 에러 발생:", err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "memberId") {
      setMemberId(value);
      if (saveId) localStorage.setItem("saveId", value);
    }
    if (name === "memberPwd") setMemberPwd(value);
  };

  const handleSaveIdChange = (e) => {
    const checked = e.target.checked;
    setSaveId(checked);
    if (checked) {
      localStorage.setItem("saveId", memberId);
    } else {
      localStorage.removeItem("saveId");
    }
  };

  return (
    <div className="login-form">
      <div className="login-logo-wrap">
        <img
          className="login-logo"
          src={getAssetUrl("/images/Memorif-logo.png")}
          alt="Memorif logo"
        />
      </div>
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="id"
          name="memberId"
          value={memberId}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="memberPwd"
          value={memberPwd}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
      </form>

      <div className="login-remember">
        <label className="remember-id">
          <input type="checkbox" checked={saveId} onChange={handleSaveIdChange} />
          <span>아이디 저장</span>
        </label>
        <div className="login-find">
          <Link to="/auth/find-id">id 찾기</Link>
          <span className="divider">|</span>
          <Link to="/auth/find-pw">password 찾기</Link>
        </div>
      </div>

      <div className="login-links">
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginForm;
