import "../css/Find/FindIdForm.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerify from "./EmailVerify";

const FindIdForm = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");

  const findId = (e) => {
    e.preventDefault();
    // TODO: 이메일 인증 완료 후 아이디 찾기 처리
    alert("아이디 찾기 요청!");
  };

  return (
    <form className="findid-form" onSubmit={findId}>

      <h2 className="findid-title">아이디 찾기</h2>
      <p className="findid-desc">가입 시 입력한 이름과 이메일을 입력하세요.</p>

      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* ✅ 이메일 인증 공통 컴포넌트 */}
      <EmailVerify />

      <button type="submit" className="findid-btn">
        아이디 찾기
      </button>

      <button
        type="button"
        className="findid-back"
        onClick={() => navigate(-1)}
      >
        뒤로가기
      </button>

    </form>
  )
}

export default FindIdForm
