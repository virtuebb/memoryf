import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountSection from "../components/AccountSection";
import SecuritySection from "../components/SecuritySection";
import ActivitySection from "../components/ActivitySection";
import PaymentSection from "../components/PaymentSection";
import PreferenceSection from "../components/PreferenceSection";

import "../css/Settings.css";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate(); // ✅ 이 줄 필수

  // onClick - 로그아웃 함수
  const handleLogout = () => {

    localStorage.removeItem("accessToken");

    // 뒤로가기 막기
    navigate("/login", {replace : true});
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>설정</h1>
        <p>계정 및 개인 설정을 관리하세요.</p>

        <button
          type="button"
          className="settings-home-btn"
          onClick={() => navigate("/home")}
        >
          🏠 홈으로
        </button>
      </header>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
            계정 정보
          </button>

          <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
            보안
          </button>

          <button className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>
            활동 내역
          </button>

          <button className={activeTab === "payment" ? "active" : ""} onClick={() => setActiveTab("payment")}>
            결제 내역
          </button>

          <button className={activeTab === "preferences" ? "active" : ""} onClick={() => setActiveTab("preferences")}>
            환경 설정
          </button>

          {/* 로그아웃 버튼 추가 */}
          <button type="button" onClick={handleLogout}>로그아웃</button>
        </aside>

        <section className="settings-content">
          {activeTab === "account" && <AccountSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "activity" && <ActivitySection />}
          {activeTab === "payment" && <PaymentSection />}
          {activeTab === "preferences" && <PreferenceSection />}
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
