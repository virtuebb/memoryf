import "../css/Signup/SignupForm.css"
import { useNavigate } from "react-router-dom";
import EmailVerify from "./EmailVerify";
import { useState } from "react";

const SignupForm = () => {

  const navigate = useNavigate();

  // 약관 동의
  const [agree, setAgree] = useState({
    all : false,
    terms : false,
    privacy : false
  });

  // 전체동의/해제
  const toggleAll = (checked) => {

    setAgree({
      all : checked,
      terms : checked,
      privacy : checked
    })
  };

  // 각 동의/해제
  const toggleOne = (name, checked) => {

    const next = {...agree, [name] : checked};
    next.all = next.terms && next.privacy;
    setAgree(next);
  }

  const signup = (e) => {
    e.preventDefault();

    if(!agree.terms || !agree.privacy) {

      alert("필수 약관에 동의해주세요.");

      return;

    } else {
      
        
        alert("가입 완료");

        navigate("/login");
    }
  };

  // 뒤로가기
  const goBack = () => {

    navigate(-1);
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

      {/* 약관 동의 */}
      <div className="signup-terms">
        <label>
          <input type="checkbox" checked={agree.all} onChange={(e) => toggleAll(e.target.checked)} />
          전체 동의
        </label>
        
        <hr />

        <label>
          <input type="checkbox" checked={agree.terms} onChange={(e) => toggleOne("terms", e.target.checked)} />
          (필수)이용약관 동의
        </label>

        <details>
          <summary>보기</summary>
          <pre>
            {`[이용약관]
            - 본 서비스는 개인 기록용 서비스입니다.
            - 불법적인 사용을 금지합니다.`}
          </pre>
        </details>

        <label>
          <input type="checkbox" checked={agree.privacy} onChange={(e) => toggleOne("privacy", e.target.checked)} />
          (필수) 개인정보 수집 및 이용 동의
        </label>

        <details>
          <summary>보기</summary>
          <pre>
            {`[개인정보 수집 및 이용]
            - 수집 항목: 아이디, 비밀번호, 이메일,
                         전화번호, 이름, 핸드폰번호,
                         생년월일

            - 이용 목적: 회원관리
            - 보유 기간: 회원 탈퇴 시까지`}
          </pre>
        </details>
      </div>

      {/* 가입, 뒤로가기 버튼 */}
      <div className="signup-buttons">
        <button type="submit">가입하기</button>
        <button type="button" onClick={goBack}>뒤로가기</button>
      </div>

    </form>
  )
}

export default SignupForm
