import "../css/Login/LoginForm.css";

const LoginForm = () => {
  return (
    <form className="login-form">
        <div className="login-logo-wrap">
            <img
            className="login-logo"
            src="http://localhost:8006/memoryf/images/Memorif-logo.png"
            alt="Memorif logo"
            />
        </div>

        <input type="text" placeholder="id" />
        <input type="password" placeholder="password" />

        <button type="submit">로그인</button>

        {/* 아이디 저장 */}
        <div className="login-remember">
        <label className="remember-id">
            <input type="checkbox" />
            <span>아이디 저장</span>
        </label>

        {/* id/pw 찾기 */}
        <div className="login-find">
            <a href="/member/find-id">id 찾기</a>
            <span className="divider">|</span>
            <a href="/member/find-pw">password 찾기</a>
        </div>
        </div>

        {/* 회원가입 */}
        <div className="login-links">
            <a href="/member/signup">회원가입</a>
        </div>
    </form>

  );
};

export default LoginForm;
