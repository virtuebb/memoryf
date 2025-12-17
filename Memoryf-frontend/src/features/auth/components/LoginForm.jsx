import "../css/Login/LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import loginMemberApi from "../api/loginApi";
import { useState, useEffect } from "react";

const LoginForm = () => {

    const navigate = useNavigate();

    const [memberId, setMemberId] = useState("");
    const [memberPwd, setMemberPwd] = useState("");

    // 아이디 저장
    const [saveId, setSaveId] = useState(false);

    useEffect(() => {

        const idSave = localStorage.getItem("saveId");

        if(idSave) {

            setMemberId(idSave);
            setSaveId(true);
        }
    }, []);

    const login = async (e) => {

        e.preventDefault();

        const token = await loginMemberApi(memberId, memberPwd);

        if(token) {

            localStorage.setItem("accessToken", token);

            if (saveId) {

                localStorage.setItem("saveId", memberId);

        } else {

            localStorage.removeItem("saveId");

        }

            navigate("/home");

        } else {

            alert("로그인 정보가 일치하지 않습니다.");
        }
    };
    
    // onChange - handleChange 함수
    const handleChange = (e) => {

        const {name, value} = e.target;

        if(name === "memberId") {
            
            setMemberId(value);

            // 아이디 저장
            if(saveId) {

                localStorage.setItem("saveId", value);
            }
        }

        if(name === "memberPwd") {
            
            setMemberPwd(value);
        
        }
    }

    // onChange - handleSaveIdChange 함수
    const handleSaveIdChange = (e) => {

        const checked = e.target.checked;

        setSaveId(checked);

        if(checked) {

            localStorage.setItem("saveId", memberId);
            
        } else {

            localStorage.removeItem("saveId");
        }

    }


  return (
    <div className="login-form">
        <div className="login-logo-wrap">
            <img
            className="login-logo"
            src="http://localhost:8006/memoryf/images/Memorif-logo.png"
            alt="Memorif logo" />
        </div>
        <form onSubmit={login}>
            <input type="text" placeholder="id" name="memberId" value={memberId} onChange={handleChange} />
            <input type="password" placeholder="password" name="memberPwd" value={memberPwd} onChange={handleChange} />

            <button type="submit">로그인</button>
        </form>

            {/* 아이디 저장 */}
            <div className="login-remember">
                <label className="remember-id">
                    <input type="checkbox" checked={saveId} onChange={handleSaveIdChange} />
                    <span>아이디 저장</span>
                </label>
            
            {/* id/pw 찾기 */}
            <div className="login-find">
                <Link to="/auth/find-id">id 찾기</Link>
                <span className="divider">|</span>
                <Link to="/auth/find-pw">password 찾기</Link>
            </div>
        </ div>

        {/* 회원가입 */}
        <div className="login-links">
            <Link to="/signup">회원가입</Link>
        </div>
    </div>

  );
};

export default LoginForm;
