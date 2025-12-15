import './App.css'

import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage from './features/member/pages/LoginPage';
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
import DmRoomListPage from './features/dm/pages/DmRoomListPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';
import FeedUploadModal from './features/feed/components/FeedUploadModal';

function App() {
  // 인증 미구현 상태라 우선 임시로 true로 고정
  const isLoggedIn = true;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedReloadKey, setFeedReloadKey] = useState(0); // 피드 목록 새로고침 트리거
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state && state.backgroundLocation;

  // 로그인 전 화면: LoginForm만 렌더
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <LoginPage />
      </div>
    );
  }

  // 로그인 후 화면
  return (
    <div className="app-root">
      <div className="main-layout">

        <aside className="left-column">
          <Header />
          <BgmPlayer />
          <Sidebar onCreateClick={() => setIsModalOpen(true)} />
          <HomeVisitorList />
        </aside>
        

        {/* 오른쪽 메인 콘텐츠: 라우트로 동적 렌더 */}
        <main className="main-content">
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
            <Route path="/feeds/:feedNo" element={<FeedDetailPage />} />
            <Route path="/feeds/new" element={<FeedUploadPage />} />
            <Route path="/diaries" element={<DiaryPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/messages" element={<DmRoomListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          {/* 모달 라우트: 백그라운드 위치가 있을 때만 표시 */}
          {backgroundLocation && (
            <Routes>
              <Route path="/feeds/:feedNo" element={<FeedDetailPage isModal />} />
            </Routes>
          )}
        </main>
      </div>

      <Footer />
      
      {/* 피드 작성 모달 */}
      <FeedUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          // 피드 목록 페이지로 이동 + 새로고침 트리거
          setFeedReloadKey((prev) => prev + 1);
          navigate('/feeds');
        }}
      />
    </div>
  );

}

export default App
