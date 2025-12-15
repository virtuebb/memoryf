import "../css/Signup/SignupForm.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignupForm = () => {

    const [codeOpen, setCodeOpen] = useState(false);

    const openCodeInput = () => {

        setCodeOpen(true);
    }



    const navigate = useNavigate();

    
    const goBack = () => {

        navigate(-1); // 이전 페이지로 이동
    };

    const signup = (e) => {

        e.preventDefault();

        navigate("/login")

        alert("가입 완료")
    }

    return (
        <form className="signup-form" onSubmit={signup}>

        <input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <input type="password" placeholder="비밀번호 확인" />
        <input type="text" placeholder="이름" />

        <div className="gender-group">
            <label>
            <input type="radio" name="gender" value="M" /> 남
            </label>
            <label>
            <input type="radio" name="gender" value="F" /> 여
            </label>
        </div>

        <label className="birth-label">생년월일</label>
        <input type="date" />
        <input type="tel" placeholder="전화번호" />

        {/* 이메일 */}
        <div className="email-row">
            <input type="email" placeholder="이메일" />
            <button
                type="button"
                className="email-btn"
                onClick={openCodeInput}
                disabled={codeOpen}>
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

            <button type="button" className="code-check-btn">
            인증번호 확인
            </button>

            <p className="code-ment">
            인증번호를 입력해주세요
            </p>
        </div>
        )}


        <input type="text" placeholder="닉네임" />

        <div className="signup-buttons">
            <button type="submit">가입하기</button>
            <button type="button" onClick={goBack}>뒤로가기</button>
        </div>

        </form>

  
    )
}

export default SignupForm