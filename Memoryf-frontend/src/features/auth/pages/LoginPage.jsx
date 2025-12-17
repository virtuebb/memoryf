import LoginForm from "../components/LoginForm";
import "../css/Login/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* 왼쪽 소개 영역 */}
      <div className="login-intro">
        <h1>Memoryf</h1>
        <p>
          추억을 기록하고,<br />
          나만의 공간을 만들어보세요.
        </p>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="login-form-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
