import './App.css'

import { Routes, Route, Navigate } from "react-router-dom";
import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';
import HomePage from './features/home/pages/HomePage';
import SearchPage from './features/search/pages/SearchPage';
import FeedListPage from './features/feed/pages/FeedListPage';
import FeedUploadPage from './features/feed/pages/FeedUploadPage';
import GuestbookPage from './features/cyworld/pages/GuestbookPage';
import DmRoomListPage from './features/dm/pages/DmRoomListPage';
import DmChatPage from './features/dm/pages/DmChatPage';
import SettingsPage from './features/settings/pages/SettingsPage';
import BgmPlayer from './features/cyworld/components/BgmPlayer';
import HomeVisitorList from './features/cyworld/components/HomeVisitorList';

// 이정민 화면
import LoginPage from './features/member/pages/LoginPage';
import DiaryPage from './features/cyworld/pages/DiaryPage';
import SignupPage from './features/member/pages/SignupPage';

function App() {

  // 인증 미구현 상태라 우선 임시로 true로 고정
  const isLoggedIn = false;

  // 로그인 전 화면: LoginForm만 렌더
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
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/feeds" element={<FeedListPage />} />
            <Route path="/feeds/new" element={<FeedUploadPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/messages" element={<DmRoomListPage />} />
            <Route path="/messages/:chatId" element={<DmChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* 이정민 */}
            <Route path="/diaries" element={<DiaryPage />} />

          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );

}

export default App
