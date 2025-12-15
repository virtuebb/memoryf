import "../css/Signup/SignupPage.css"
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="signup-page">
      {/* 왼쪽 소개 영역 */}
      <div className="signup-intro">
        <h1>Memoryf</h1>
        <p>
          추억을 기록하고,<br />
          나만의 공간을 만들어보세요.
        </p>
      </div>

      {/* 회원가입 폼 */}
      <div className="signup-form-wrapper">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;