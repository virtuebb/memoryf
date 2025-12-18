import "../css/Signup/SignupForm.css"
import { useNavigate } from "react-router-dom";
import EmailVerify from "./EmailVerify";
import { useState } from "react";

const SignupForm = () => {

  const navigate = useNavigate();

  // 회원가입 정보 담기
  const memberInfo = {
    memberId : "",
    memberPwd : "",
    memberPwdConfirm : "",
    memberName : "",
    memberNick : "",
    gender : "",
    phone : "",
    email : "",
    birthday : ""
  };

  // 회원가입 정보 state
  const [form, setForm] = useState(memberInfo);

  // 비밀번호 확인여부 state
  const [pwdMatch, setPwdMatch] = useState(null);

  // 약관동의 정보 state
  const [agree, setAgree] = useState({
    all : false,
    terms : false,
    privacy : false
  });

  const checkPassword = () => {

    // 비밀번호 비어있을 경우, 일치 및 불일치 표시 안함
    if(!form.memberPwd || !form.memberPwdConfirm) {

      setPwdMatch(null);

      return;
    }

    // 비밀번호 일치 여부 확인
    setPwdMatch(form.memberPwd === form.memberPwdConfirm); // === : true or false 리턴
  };

  // 이용약관 전체동의/해제
  const toggleAll = (checked) => {

    setAgree({
      all : checked,
      terms : checked,
      privacy : checked
    })
  };

  // 이용약관 각 동의/해제
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

  // onChange 비밀번호 확인 얕은복사 (깊은복사 없어도 됨)
  const handleChange = (e) => {

    const {name, value} = e.target;

    setForm(prev => {
      const next = {...prev};

      next[name] = value;

      return next;
    })
  }

  // 비밀번호 일치 여부 블러메시지
  const renderPwdMsg = () => {

    if(pwdMatch === true) {

      return <p className="pwd-ok">비밀번호가 일치합니다.</p>
    
    } else if(pwdMatch === false) {

      return <p className="pwd-fail">비밀번호가 일치하지 않습니다.</p>
    } 

    return null;
  };

  // 뒤로가기
  const goBack = () => {

    navigate(-1);
  };

  return (
    <form className="signup-form" onSubmit={signup}>

      <input type="text" name="memberId" value={form.memberId} onChange={handleChange} placeholder="아이디(4 ~ 12자, 영문 소문자, 숫자만 사용 가능)" />
      <input type="password" name="memberPwd" value={form.memberPwd} onChange={handleChange} placeholder="비밀번호(8 ~ 16자, 영문+숫자 필수, 특수문자 사용 가능)" />
      <input type="password" name="memberPwdConfirm" value={form.memberPwdConfirm} onBlur={checkPassword} onChange={handleChange} placeholder="비밀번호 확인" />

      {/* 비밀번호 확인 멘트 */}
      {renderPwdMsg()}
      
      <input type="text" name="memberName" value={form.memberName} onChange={handleChange} placeholder="이름" />

      <div className="gender-group">
        <label><input type="radio" name="gender" value="M" onChange={handleChange} checked={form.gender === 'M'} /> 남</label>
        <label><input type="radio" name="gender" value="F" onChange={handleChange} checked={form.gender === 'F'} /> 여</label>
      </div>

      <label className="birth-label">생년월일</label>
      <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="전화번호" />

      {/* ✅ 이메일 인증 공통 컴포넌트 */}
      <EmailVerify email={form.email} onChange={handleChange} />

      <input type="text" name="memberNick" value={form.memberNick} onChange={handleChange} placeholder="닉네임(2 ~ 10자, 한글, 영문, 숫자, 기호 _, . 사용 가능)" />

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
