import './App.css';

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './utils/jwt';

// 공통
import BgmPlayer from './shared/components/BgmPlayer.jsx';
import Visitors from './shared/components/Visitors.jsx';
import SkinButton from './shared/components/SkinButton.jsx';
import { ThemeProvider } from './shared/components/ThemeContext.jsx';

// 레이아웃
import Header from './shared/components/Header.jsx';
import Sidebar from './shared/components/Sidebar.jsx';
import Footer from './shared/components/Footer.jsx';

// 홈
import Home from './features/home/pages/Home';

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
import DiaryPage from "./features/diary/pages/DiaryPage";

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

// 지도
import MapTestPage from './features/map/pages/MapTestPage';

function App() {
  const isLoggedIn = isAuthenticated();
  const isAdmin = false;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null); // 수정할 피드 데이터
  const [feedReloadKey, setFeedReloadKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // 설정 페이지 여부
  const isSettings = location.pathname.startsWith('/settings');

  // openFeedModal 이벤트 리스너 등록
  useEffect(() => {
    const handleOpenFeedModal = () => {
      setIsModalOpen(true);
    };
    
    window.addEventListener('openFeedModal', handleOpenFeedModal);
    
    return () => {
      window.removeEventListener('openFeedModal', handleOpenFeedModal);
    };
  }, []);

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
        <div className={`main-layout ${isSettings ? "settings-mode" : ""}`}>
          {/* ✅ Settings 아닐 때만 사이드바 -> Settings일 때도 사이드바 표시 */}
          {/* {!isSettings && ( */}
         <aside className="left-column">
            {/* 1. 로고 */}
            <Header />

            {/* 2. BGM 플레이어 */}
            <div className="sidebar-section card">
              <BgmPlayer />
            </div>

            {/* 3. 메뉴 */}
            <Sidebar onCreateClick={() => setIsModalOpen(true)} />

            {/* 4. 방문자 */}
            <div className="sidebar-section card">
              <Visitors />
            </div>

            {/* 5. 테마 버튼 */}
            <div className="sidebar-section card">
              <SkinButton />
            </div>
          </aside>
          {/* )} */}

          {/* 메인 콘텐츠 */}
          <main className={`main-content ${isSettings ? "settings-mode" : ""}`}>
            <Routes location={backgroundLocation || location}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              {/* 🔥 지도 테스트 */}
              <Route path="/map-test" element={<MapTestPage />} />

              {/* 홈 */}
              <Route path="/home" element={<Home />} />
              <Route path="/home/:memberNo" element={<Home />} />
              <Route path="/:memberNick" element={<Home />} />

              {/* 기타 */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
              <Route path="/messages/*" element={<DmRoutes />} />
              {/* 채팅 테스트 주소 */}
              <Route path="/chat-test" element={<Chat />} />
              <Route path="/settings/*" element={<SettingsPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

              {/* 🔥 피드 상세 모달 라우트 */}
              {backgroundLocation && (
                <Routes>
                  <Route
                    path="/feeds/:feedNo"
                    element={
                      <FeedDetailPage
                        isModal
                        onEditFeed={(feed) => {
                          setEditingFeed(feed);
                          setIsModalOpen(true);
                        }}
                      />
                    }
                  />
                </Routes>
              )}
            </main>
        </div>

        <Footer />

        <FeedUploadModal
          isOpen={isModalOpen}
          mode={editingFeed ? 'edit' : 'create'}
          initialFeed={editingFeed}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFeed(null);
          }}
          onSuccess={() => {
            const wasEditMode = !!editingFeed;
            setIsModalOpen(false);
            setEditingFeed(null);
            setFeedReloadKey(prev => prev + 1);
            window.dispatchEvent(new Event('feedChanged'));
            if (!wasEditMode) {
              navigate('/feeds');
            }
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
