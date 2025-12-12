import './App.css'

import { Routes, Route } from "react-router-dom";
import LoginPage from './features/member/pages/LoginPage';
import Header from './shared/components/Header';
import Sidebar from './shared/components/Sidebar';
import Footer from './shared/components/Footer';
import HomePage from './features/home/pages/HomePage';

function App() {
  // 인증 미구현 상태라 우선 임시로 true로 고정
  const isLoggedIn = true;

  if (!isLoggedIn) {
    // 로그인 전 화면: LoginForm만 렌더
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
        
        {/* 왼쪽 고정 컬럼: 헤더(로고), 상단 BGM, 중단 사이드바, 하단 방문자 */}
        <aside className="left-column">
          <Header />

          <div className="left-section bgm">
            <div className="section-label">BGM</div>
            <div className="section-content">BGM Player (고정)</div>
          </div>

          <div className="left-section sidebar-wrap">
            <div className="section-label">Menu</div>
            <div className="section-content"><Sidebar /></div>
          </div>

          <div className="left-section visitors">
            <div className="section-label">Visitors</div>
            <div className="section-content">123</div>
          </div>
        </aside>

        {/* 오른쪽 메인 콘텐츠: 라우트로 동적 렌더 */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );

}

export default App
