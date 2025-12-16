import "../css/Login/LoginForm.css";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {

    const navigate = useNavigate();

    const login = (e) => {

        e.preventDefault();

        navigate("/home")
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
            <input type="text" placeholder="id" />
            <input type="password" placeholder="password" />

            <button type="submit">로그인</button>
        </form>

            {/* 아이디 저장 */}
            <div className="login-remember">
                <label className="remember-id">
                    <input type="checkbox" />
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
