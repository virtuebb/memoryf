import "../css/Signup/SignupForm.css"
import { useNavigate } from "react-router-dom";
import EmailVerify from "./EmailVerify";

const SignupForm = () => {

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const signup = (e) => {
    e.preventDefault();
    navigate("/login");
    alert("가입 완료");
  };

  return (
    <form className="signup-form" onSubmit={signup}>

      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <input type="password" placeholder="비밀번호 확인" />
      <input type="text" placeholder="이름" />

      <div className="gender-group">
        <label><input type="radio" name="gender" value="M" /> 남</label>
        <label><input type="radio" name="gender" value="F" /> 여</label>
      </div>

      <label className="birth-label">생년월일</label>
      <input type="date" />
      <input type="tel" placeholder="전화번호" />

      {/* ✅ 이메일 인증 공통 컴포넌트 */}
      <EmailVerify />

      <input type="text" placeholder="닉네임" />

      <div className="signup-buttons">
        <button type="submit">가입하기</button>
        <button type="button" onClick={goBack}>뒤로가기</button>
      </div>

    </form>
  )
}

export default SignupForm
