import './App.css';

import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// 레이아웃
import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';

// 일반 사용자
import HomePage from './features/home/pages/HomePage';
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedDetailPage from './features/feed/pages/FeedDetailPage';
import FeedUploadModal from './features/feed/components/FeedUploadModal';
import DiaryPage from './features/cyworld/pages/DiaryPage';
import GuestbookPage from './features/cyworld/pages/GuestbookPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';
import DmRoutes from './features/dm/pages/DmRoutes';

// 멤버 (로그인/가입/찾기)
import LoginPage from './features/member/pages/LoginPage';
import SignupPage from './features/member/pages/SignupPage';
import FindIdPage from './features/member/pages/FindIdPage';
import FindPasswordPage from './features/member/pages/FindPasswordPage';
import ResetPasswordForm from './features/member/components/ResetPasswordForm';

// 관리자
import AdminLayout from './features/admin/components/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import ReportManagementPage from './features/admin/pages/ReportManagementPage';
import PaymentManagementPage from './features/admin/pages/PaymentManagementPage';
import BgmManagementPage from './features/admin/pages/BgmManagementPage';

// 기타
import { ThemeProvider } from "./features/main/components/ThemeContext";


function App() {

  const isLoggedIn = false;
  const isAdmin = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedReloadKey, setFeedReloadKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* 아이디, 비밀번호 찾기 */}
          <Route path="/member/find-id" element={<FindIdPage />} />
          <Route path="/member/find-pw" element={<FindPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Routes>
      </div>
    );
  }

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

  return (
      <ThemeProvider>
        <div className="app-root">
          <div className="main-layout">
            <aside className="left-column">
              <Header />
              <BgmPlayer />
              <Sidebar onCreateClick={() => setIsModalOpen(true)} />
              <HomeVisitorList />
            </aside>

            <main className="main-content">
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/feeds" element={<FeedListPage />} />
                <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
                <Route path="/guestbook" element={<GuestbookPage />} />
                <Route path="/messages/*" element={<DmRoutes />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* 이정민 */}
                <Route path="/diaries" element={<DiaryPage />} />

                {/* 기본 경로 리다이렉트 */}
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
            setFeedReloadKey((prev) => prev + 1);
            navigate('/feeds');
          }}
        />
        </div>
      </ThemeProvider>
    );
  }

export default App;
