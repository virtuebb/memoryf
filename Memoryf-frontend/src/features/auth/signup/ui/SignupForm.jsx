import "../../css/Signup/SignupForm.css";
import { useNavigate } from "react-router-dom";
import EmailVerify from "../../email-verify";
import { useState } from "react";
import { signupApi, checkIdApi, checkNickApi } from "../../api";

const SignupForm = () => {
  const navigate = useNavigate();

  // 회원가입 정보 담기
  const memberInfo = {
    memberId: "",
    memberPwd: "",
    memberPwdConfirm: "",
    memberName: "",
    memberNick: "",
    gender: "",
    phone: "",
    email: "",
    birthday: "",
  };

  // 회원가입 정보 state
  const [form, setForm] = useState(memberInfo);

  // 아이디 중복확인 state
  const [idChecked, setIdChecked] = useState(null);

  // 닉네임 중복확인 state
  const [nickChecked, setNickChecked] = useState(null);

  // 비밀번호 확인여부 state
  const [pwdMatch, setPwdMatch] = useState(null);

  // 아이디, 비밀번호, 닉네임 형식 state
  const [idValid, setIdValid] = useState(null);
  const [pwdValid, setPwdValid] = useState(null);
  const [nickValid, setNickValid] = useState(null);

  // 아이디, 비밀번호, 닉네임 규칙 정규식
  const idRegex = /^[a-z0-9]{4,12}$/;
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,16}$/;
  const nickRegex = /^[A-Za-z0-9가-힣_.]{2,10}$/;

  // 이메일 인증 완료 여부state
  const [emailVerified, setEmailVerified] = useState(false);

  // 약관동의 정보 state
  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
  });

  // 아이디 중복확인
  const checkDuplicatedId = async () => {
    const result = await checkIdApi(form.memberId);

    if (result === null) {
      return;
    }

    // result가 { available: boolean } 형태
    setIdChecked(result?.available ?? false);
  };

  // 닉네임 중복확인
  const checkDuplicatedNick = async () => {
    const result = await checkNickApi(form.memberNick);

    if (result === null) {
      return;
    }

    // result가 { available: boolean } 형태
    setNickChecked(result?.available ?? false);
  };

  // 아이디 중복확인 멘트(블러)
  const idDupMsg = () => {
    if (idChecked === true) return <p className="type-ok">사용 가능한 아이디입니다.</p>;
    if (idChecked === false) return <p className="type-fail">이미 사용 중인 아이디입니다.</p>;

    return null;
  };

  // 닉네임 중복확인 멘트(블러)
  const nickDupMsg = () => {
    if (nickChecked === true) return <p className="type-ok">사용 가능한 닉네임입니다.</p>;
    if (nickChecked === false) return <p className="type-fail">이미 사용 중인 닉네임입니다.</p>;

    return null;
  };

  // 비밀번호 일치여부 확인
  const checkPassword = () => {
    checkPwdType(); // 형식 검사도 하기

    // 비밀번호 비어있을 경우, 일치 및 불일치 표시 안함
    if (!form.memberPwd || !form.memberPwdConfirm) {
      setPwdMatch(null);

      return;
    }

    // 비밀번호 일치 여부 확인
    setPwdMatch(form.memberPwd === form.memberPwdConfirm); // === : true or false 리턴
  };

  // 이용약관 전체동의/해제
  const toggleAll = (checked) => {
    setAgree({
      all: checked,
      terms: checked,
      privacy: checked,
    });
  };

  // 이용약관 각 동의/해제
  const toggleOne = (name, checked) => {
    const next = { ...agree, [name]: checked };
    next.all = next.terms && next.privacy;
    setAgree(next);
  };

  // 가입하기 버튼
  const signup = async (e) => {
    e.preventDefault();

    if (
      !form.memberId ||
      !form.memberPwd ||
      !form.memberPwdConfirm ||
      !form.memberName ||
      !form.memberNick ||
      !form.gender ||
      !form.phone ||
      !form.email ||
      !form.birthday
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!idRegex.test(form.memberId)) {
      alert("아이디 형식을 확인해주세요.");
      return;
    }

    if (idChecked !== true) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }

    if (!pwdRegex.test(form.memberPwd)) {
      alert("비밀번호 형식을 확인해주세요.");
      return;
    }

    if (form.memberPwd !== form.memberPwdConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!nickRegex.test(form.memberNick)) {
      alert("닉네임 형식을 확인해주세요.");
      return;
    }

    if (nickChecked !== true) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }

    if (!agree.terms || !agree.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    // 서버로 보낼 데이터
    const payload = {
      memberId: form.memberId,
      memberPwd: form.memberPwd,
      memberName: form.memberName,
      memberNick: form.memberNick,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      birthday: form.birthday,
    };

    // 회원가입 API 호출
    const result = await signupApi(payload);

    // API가 성공하면 null이 아닌 값 반환 (getApiResponseData 적용됨)
    if (result !== null) {
      alert("가입 완료");
      navigate("/login");
    } else {
      alert("회원가입 실패");
    }
  };

  // onChange - handleChange 얕은복사
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 이메일 바꾸면 인증 초기화
    if (name === "email") {
      setEmailVerified(false);
    }

    setForm((prev) => {
      const next = { ...prev };

      next[name] = value;

      return next;
    });
  };

  // 비밀번호 일치 여부 블러메시지
  const renderPwdMsg = () => {
    if (pwdMatch === true) {
      return <p className="type-ok">비밀번호가 일치합니다.</p>;
    } else if (pwdMatch === false) {
      return <p className="type-fail">비밀번호가 일치하지 않습니다.</p>;
    }

    return null;
  };

  // 아이디, 비밀번호, 닉네임 형식 검사
  const checkIdType = () => {
    if (!form.memberId) return setIdValid(null);
    setIdValid(idRegex.test(form.memberId));
  };

  const checkPwdType = () => {
    if (!form.memberPwd) return setPwdValid(null);

    setPwdValid(pwdRegex.test(form.memberPwd));
  };

  const checkNickType = () => {
    if (!form.memberNick) return setNickValid(null);

    setNickValid(nickRegex.test(form.memberNick));
  };

  // 아이디 형식 일치 여부 블러 메시지
  const idTypeMsg = () => {
    if (idValid === true) return <p className="type-ok">올바른 아이디 형식입니다.</p>;
    if (idValid === false) return <p className="type-fail">올바르지 않은 아이디 형식입니다.</p>;

    return null;
  };

  // 비밀번호 형식 일치 여부 블러 메시지
  const pwdTypeMsg = () => {
    if (pwdValid === true) return <p className="type-ok">올바른 비밀번호 형식입니다.</p>;
    if (pwdValid === false) return <p className="type-fail">올바르지 않은 비밀번호 형식입니다.</p>;

    return null;
  };

  // 닉네임 형식 일치 여부 블러 메시지
  const nickTypeMsg = () => {
    if (nickValid === true) return <p className="type-ok">올바른 닉네임 형식입니다.</p>;
    if (nickValid === false) return <p className="type-fail">올바르지 않은 닉네임 형식입니다.</p>;

    return null;
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <form className="signup-form" onSubmit={signup}>
      <div className="id-row">
        <input
          type="text"
          name="memberId"
          value={form.memberId}
          onBlur={checkIdType}
          onChange={(e) => {
            handleChange(e);
            setIdChecked(null);
          }}
          placeholder="아이디(4 ~ 12자, 영문 소문자, 숫자만 사용 가능)"
        />
        <button
          type="button"
          className="id-btn"
          onClick={checkDuplicatedId}
          disabled={idValid !== true}
        >
          중복확인
        </button>
      </div>

      {/* 아이디 형식 일치 여부 멘트 */}
      {idTypeMsg()}
      {/* 아이디 중복 일치 여부 멘트 */}
      {idDupMsg()}

      <input
        type="password"
        name="memberPwd"
        value={form.memberPwd}
        onBlur={checkPwdType}
        onChange={handleChange}
        placeholder="비밀번호(8 ~ 16자, 영문+숫자 필수, 특수문자 사용 가능)"
      />

      {/* 비밀번호 형식 일치 여부 멘트 */}
      {pwdTypeMsg()}

      <input
        type="password"
        name="memberPwdConfirm"
        value={form.memberPwdConfirm}
        onBlur={checkPassword}
        onChange={handleChange}
        placeholder="비밀번호 확인"
      />

      {/* 비밀번호 일치 여부 멘트 */}
      {renderPwdMsg()}

      <input
        type="text"
        name="memberName"
        value={form.memberName}
        onChange={handleChange}
        placeholder="이름"
      />

      <div className="gender-group">
        <label>
          <input
            type="radio"
            name="gender"
            value="M"
            onChange={handleChange}
            checked={form.gender === "M"}
          />{" "}
          남
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="F"
            onChange={handleChange}
            checked={form.gender === "F"}
          />{" "}
          여
        </label>
      </div>

      <label className="birth-label">생년월일</label>
      <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="전화번호 ex) 01012345678"
      />

      {/* ✅ 이메일 인증 공통 컴포넌트 */}
      <EmailVerify
        email={form.email}
        onChange={handleChange}
        onVerified={(v) => setEmailVerified(v)}
      />

      <div className="id-row">
        <input
          type="text"
          name="memberNick"
          value={form.memberNick}
          onBlur={checkNickType}
          onChange={(e) => {
            handleChange(e);
            setNickChecked(null);
          }}
          placeholder="닉네임(2 ~ 10자, 한글, 영문, 숫자, 기호 _, . 가능)"
        />
        <button
          type="button"
          className="id-btn"
          onClick={checkDuplicatedNick}
          disabled={nickValid !== true}
        >
          중복확인
        </button>
      </div>

      {/* 닉네임 형식 일치 여부 멘트 */}
      {nickTypeMsg()}

      {/* 닉네임 중복 일치 여부 멘트 */}
      {nickDupMsg()}

      {/* 약관 동의 */}
      <div className="signup-terms">
        <label>
          <input
            type="checkbox"
            checked={agree.all}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          전체 동의
        </label>

        <hr />

        <label>
          <input
            type="checkbox"
            checked={agree.terms}
            onChange={(e) => toggleOne("terms", e.target.checked)}
          />
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
          <input
            type="checkbox"
            checked={agree.privacy}
            onChange={(e) => toggleOne("privacy", e.target.checked)}
          />
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
        <button type="button" onClick={goBack}>
          뒤로가기
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
