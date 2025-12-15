import './App.css';

import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';
import HomePage from './features/home/pages/HomePage';
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedDetailPage from './features/feed/pages/FeedDetailPage';
import FeedUploadPage from './features/feed/pages/FeedUploadPage';
import DiaryPage from './features/cyworld/pages/DiaryPage';
import GuestbookPage from './features/cyworld/pages/GuestbookPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import LoginPage from './features/member/pages/LoginPage';
import SignupPage from './features/member/pages/SignupPage';
import DmRoutes from './features/dm/pages/DmRoutes';

import AdminLayout from './features/admin/components/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import ReportManagementPage from './features/admin/pages/ReportManagementPage';
import PaymentManagementPage from './features/admin/pages/PaymentManagementPage';
import BgmManagementPage from './features/admin/pages/BgmManagementPage';

import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';
import FeedUploadModal from './features/feed/components/FeedUploadModal';

function App() {
  const isLoggedIn = true; // TODO: 실제 인증 연동
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
    <div className="app-root">
      <div className="main-layout">
        <aside className="left-column">
          <Header />
          <BgmPlayer />
          <Sidebar onCreateClick={() => setIsModalOpen(true)} />
          <HomeVisitorList />
        </aside>

        <main className="main-content">
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
            <Route path="/feeds/:feedNo" element={<FeedDetailPage />} />
            <Route path="/feeds/new" element={<FeedUploadPage />} />
            <Route path="/diaries" element={<DiaryPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/messages/*" element={<DmRoutes />} />
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
          setFeedReloadKey((prev) => prev + 1);
          navigate('/feeds');
        }}
      />
    </div>
  );
}

export default App;
