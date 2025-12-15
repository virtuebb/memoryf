import './App.css'

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';
import HomePage from './features/home/pages/HomePage';
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedUploadPage from './features/feed/pages/FeedUploadPage';
import GuestbookPage from './features/cyworld/pages/GuestbookPage';
import SettingsPage from './features/settings/pages/SettingsPage';

import AdminLayout from './features/admin/components/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import ReportManagementPage from './features/admin/pages/ReportManagementPage';
import PaymentManagementPage from './features/admin/pages/PaymentManagementPage';
import BgmManagementPage from './features/admin/pages/BgmManagementPage';

import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';

// 이정민 화면
import LoginPage from './features/member/pages/LoginPage';
import DiaryPage from './features/cyworld/pages/DiaryPage';
import SignupPage from './features/member/pages/SignupPage';
import FindIdPage from './features/member/pages/FindIdPage';
import FindPasswordPage from './features/member/pages/FindPasswordPage';
import ResetPasswordForm from './features/member/components/ResetPasswordForm';

import DmRoutes from './features/dm/pages/DmRoutes';
import { ThemeProvider } from "./features/main/components/ThemeContext";
import Home from "./features/main/components/Home";


function App() {

  const isLoggedIn = false;
  const isAdmin = true;
  const location = useLocation();
  // 현재 경로가 관리자 경로인지 확인 (/admin으로 시작하면 관리자 레이아웃 사용)
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

  // 관리자 경로일 때는 사용자용 사이드바/헤더를 숨기고 관리자 레이아웃만 렌더
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
        {/* 잘못된 관리자 경로 접근 시 관리자 홈으로 이동 */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // 일반 사용자 레이아웃
return (
    <ThemeProvider>
      <div className="app-root">
        <div className="main-layout">
          <aside className="left-column">
            <Header />
            <BgmPlayer />
            <Sidebar />
            <HomeVisitorList />
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/feeds" element={<FeedListPage />} />
              <Route path="/feeds/new" element={<FeedUploadPage />} />
              <Route path="/guestbook" element={<GuestbookPage />} />
              <Route path="/messages/*" element={<DmRoutes />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* 이정민 */}
              <Route path="/diaries" element={<DiaryPage />} />

              {/* 기본 경로 리다이렉트 */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
