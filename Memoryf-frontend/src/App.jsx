import './App.css';

import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// 공통 (사이드바)
import BgmPlayer from './shared/components/BgmPlayer.jsx';
import Visitors from './shared/components/Visitors.jsx';
import SkinButton from './shared/components/SkinButton.jsx';
import { ThemeProvider } from './shared/components/ThemeContext.jsx';

import Home from "./features/home/pages/Home";

// 레이아웃
import Header from './shared/components/Header.jsx';
import Sidebar from './shared/components/Sidebar.jsx';
import Footer from './shared/components/Footer.jsx';


// 홈(스토리)
import Storybar from './features/story/components/Storybar';

// 일반 사용자
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedDetailPage from './features/feed/pages/FeedDetailPage';
import FeedUploadModal from './features/feed/components/FeedUploadModal';
import SettingsPage from './features/settings/pages/SettingsPage';
import DmRoutes from './features/dm/pages/DmRoutes';
import FloatingDm from './features/dm/components/FloatingDm';
import Chat from './features/dm/components/Chat';
import { DmProvider } from './features/dm/context/DmContext';

// 로그인, 회원가입
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import FindIdPage from './features/auth/pages/FindIdPage';
import FindPasswordPage from './features/auth/pages/FindPasswordPage';
import ResetPasswordForm from './features/auth/components/ResetPasswordForm';

// 관리자
import AdminLayout from './features/admin/components/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import ReportManagementPage from './features/admin/pages/ReportManagementPage';
import PaymentManagementPage from './features/admin/pages/PaymentManagementPage';
import BgmManagementPage from './features/admin/pages/BgmManagementPage';

function App() {
  const isLoggedIn = true;
  const isAdmin = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedReloadKey, setFeedReloadKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 로그인 안 했을 때
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/find-id" element={<FindIdPage />} />
          <Route path="/auth/find-pw" element={<FindPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Routes>
      </div>
    );
  }

  // 관리자
  if (isAdminRoute && isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="reports" element={<ReportManagementPage />} />
          <Route path="payments" element={<PaymentManagementPage />} />
          <Route path="bgm" element={<BgmManagementPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // 일반 사용자
   return (
    <ThemeProvider>
      <DmProvider>
      <div className="app-root">
        <div className="main-layout">
         <aside className="left-column">
          {/* 1. 로고 */}
          <Header />

          {/* 3. BGM 플레이어 */}
          <div className="sidebar-section card">
            <BgmPlayer />
          </div>

          {/* 4. 메뉴 */}
          <Sidebar onCreateClick={() => setIsModalOpen(true)} />

          {/* 5. 방문자 */}
          <div className="sidebar-section card">
            <Visitors />

          {/* 2. 테마 버튼 */}
          <div className="sidebar-section card">
            <SkinButton />
          </div>

          </div>
        </aside>

          <main className="main-content">
            <Routes location={backgroundLocation || location}>
              <Route path="/home" element={<Storybar />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
              <Route path="/messages/*" element={<DmRoutes />} />
              {/* 채팅 테스트 주소 */}
              <Route path="/chat-test" element={<Chat />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

            {backgroundLocation && (
              <Routes>
                <Route path="/feeds/:feedNo" element={<FeedDetailPage isModal />} />
              </Routes>
            )}
          </main>
        </div>

        <Footer />

        <FeedUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setFeedReloadKey(prev => prev + 1);
            navigate('/feeds');
          }}
        />

        {/* 플로팅 DM (PIP 스타일 - 모든 페이지에서 사용 가능) */}
        <FloatingDm />
      </div>
      </DmProvider>
    </ThemeProvider>
  );
}

export default App;
