import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";

import SettingsEdit from "./SettingsEdit";
import SecuritySection from "../components/SecuritySection";
import ActivitySection from "../components/ActivitySection";
import PaymentSection from "../components/PaymentSection";
import PreferenceSection from "../components/PreferenceSection";

import "../css/Settings.css";

function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 URL의 마지막 경로 세그먼트를 가져와서 활성 탭 결정
  const currentPath = location.pathname.split('/').pop();
  const tabs = ['edit', 'security', 'activity', 'payment', 'preferences'];
  const activeTab = tabs.includes(currentPath) ? currentPath : 'edit';

  useEffect(() => {
    // /settings 로 직접 접근 시 /settings/edit 으로 리다이렉트
    if (location.pathname === '/settings' || location.pathname === '/settings/') {
      navigate('/settings/edit', { replace: true });
    }
  }, [location, navigate]);

  // onClick - 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login", {replace : true});
  };

  const handleTabClick = (tab) => {
    navigate(`/settings/${tab}`);
  };

  return (
    <div className="settings-page">
      {/* <header className="settings-header">
        <h1>설정</h1>

        <button
          type="button"
          className="settings-home-btn"
          onClick={() => navigate("/home")}
        >
          🏠 홈으로
        </button>
      </header> */}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-sidebar-header">
            <h2>설정</h2>
          </div>
          <div className="settings-sidebar-content">
            <button className={activeTab === "edit" ? "active" : ""} onClick={() => handleTabClick("edit")}>
              프로필 편집
            </button>

            <button className={activeTab === "security" ? "active" : ""} onClick={() => handleTabClick("security")}>
              보안
            </button>

            <button className={activeTab === "activity" ? "active" : ""} onClick={() => handleTabClick("activity")}>
              활동 내역
            </button>

            <button className={activeTab === "payment" ? "active" : ""} onClick={() => handleTabClick("payment")}>
              결제 내역
            </button>

            <button className={activeTab === "preferences" ? "active" : ""} onClick={() => handleTabClick("preferences")}>
              환경 설정
            </button>

            {/* 로그아웃 버튼 추가 */}
            <button type="button" onClick={handleLogout}>로그아웃</button>
          </div>
        </aside>

        <section className="settings-content">
          <Routes>
            <Route path="edit" element={<SettingsEdit />} />
            <Route path="security" element={<SecuritySection />} />
            <Route path="activity" element={<ActivitySection />} />
            <Route path="payment" element={<PaymentSection />} />
            <Route path="preferences" element={<PreferenceSection />} />
            <Route path="*" element={<Navigate to="edit" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
