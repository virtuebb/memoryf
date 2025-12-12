import './App.css'

import { Routes, Route } from "react-router-dom";
import LoginPage from './features/member/pages/LoginPage';
import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';
import HomePage from './features/home/pages/HomePage';
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedUploadPage from './features/feed/pages/FeedUploadPage';
import DiaryPage from './features/cyworld/pages/DiaryPage';
import GuestbookPage from './features/cyworld/pages/GuestbookPage';
import DmRoomListPage from './features/dm/pages/DmRoomListPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';

function App() {
  // 인증 미구현 상태라 우선 임시로 true로 고정
  const isLoggedIn = true;

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
          <Sidebar />
          <HomeVisitorList />
        </aside>
        

        {/* 오른쪽 메인 콘텐츠: 라우트로 동적 렌더 */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/feeds" element={<FeedListPage />} />
            <Route path="/feeds/new" element={<FeedUploadPage />} />
            <Route path="/diaries" element={<DiaryPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/messages" element={<DmRoomListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );

}

export default App
