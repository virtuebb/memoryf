import React from 'react';
import Stories from '../../story/components/Stories'; // story 컴포넌트 경로
import ProfileSection from '../components/ProfileSection';
import Guestbook from '../components/Guestbook';

function HomePage() {
  return (
    <div className="home-page-layout">
      {/* 헤더 바로 아래, 홈에서만 보이는 스토리 */}
      <div className="stories-and-header-right">
        <Stories />
      </div>

      <div className="content-columns">
        <div className="column-center">
          <ProfileSection />
          
        </div>

        <div className="column-right">
          <Guestbook />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
