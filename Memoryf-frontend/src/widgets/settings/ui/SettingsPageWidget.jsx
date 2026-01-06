import "./SettingsPageWidget.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate, Route, Routes } from "react-router-dom";

import SettingsEditWidget from "./SettingsEditWidget.jsx";
import { ActivitySection, PaymentSection, PreferenceSection, SecuritySection } from "../../../features/settings";
import { useAuth } from "../../../features/auth/model/useAuth";

function SettingsPageWidget() {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	// 현재 URL의 마지막 경로 세그먼트를 가져와서 활성 탭 결정
	const currentPath = location.pathname.split("/").pop();
	const tabs = ["edit", "security", "activity", "payment", "preferences"];
	const activeTab = tabs.includes(currentPath) ? currentPath : "edit";

	// 로그아웃 모달 상태
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	useEffect(() => {
		// /settings 로 직접 접근 시 /settings/edit 으로 리다이렉트
		if (location.pathname === "/settings" || location.pathname === "/settings/") {
			navigate("/settings/edit", { replace: true });
		}
	}, [location, navigate]);

	// 로그아웃 버튼 클릭 핸들러 (모달 열기)
	const handleLogoutClick = () => {
		setIsLogoutModalOpen(true);
	};

	// 실제 로그아웃 처리
	const confirmLogout = () => {
		logout(); // AuthContext의 logout 함수 호출 (토큰 제거 + 상태 업데이트)
		navigate("/login", { replace: true });
	};

	// 모달 닫기
	const closeLogoutModal = () => {
		setIsLogoutModalOpen(false);
	};

	const handleTabClick = (tab) => {
		navigate(`/settings/${tab}`);
	};

	return (
		<div className="settings-page">
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

						<button
							className={activeTab === "preferences" ? "active" : ""}
							onClick={() => handleTabClick("preferences")}
						>
							계정 공개 범위
						</button>

						{/* 로그아웃 버튼 추가 */}
						<button type="button" onClick={handleLogoutClick}>
							로그아웃
						</button>
					</div>
				</aside>

				<section className="settings-content">
					<Routes>
						<Route path="edit" element={<SettingsEditWidget />} />
						<Route path="security" element={<SecuritySection />} />
						<Route path="activity" element={<ActivitySection />} />
						<Route path="payment" element={<PaymentSection />} />
						<Route path="preferences" element={<PreferenceSection />} />
						<Route path="*" element={<Navigate to="edit" replace />} />
					</Routes>
				</section>
			</div>

			{/* 로그아웃 확인 모달 */}
			{isLogoutModalOpen && (
				<div className="logout-modal-overlay" onClick={closeLogoutModal}>
					<div className="logout-modal" onClick={(e) => e.stopPropagation()}>
						<div className="logout-modal-header">
							<h3>로그아웃 하시겠습니까?</h3>
							<p>로그아웃하면 다시 로그인해야 합니다.</p>
						</div>
						<div className="logout-modal-actions">
							<button className="logout-modal-btn confirm" onClick={confirmLogout}>
								로그아웃
							</button>
							<button className="logout-modal-btn cancel" onClick={closeLogoutModal}>
								취소
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default SettingsPageWidget;
