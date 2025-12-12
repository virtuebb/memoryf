import React from 'react';
import Stories from '../../story/components/Stories'; // story 컴포넌트 경로
import ProfileSection from '../components/ProfileSection';
import GuestbookItem from '../../cyworld/components/GuestbookItem';

const mockGuestbooks = [
  { id: 1, author: '하루손님', message: '첫 방문! 안녕하세요 🙌', date: '2024-05-05' },
  { id: 2, author: '기억수집가', message: '사진 잘 보고 갑니다.', date: '2024-05-06' },
  { id: 3, author: '호미', message: '오늘도 좋은 하루 되세요 :)', date: '2024-05-07' },
];

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
          <section className="guestbook">
            <h3>방명록</h3>
            <div className="guestbook-list">
              {mockGuestbooks.map((item) => (
                <GuestbookItem key={item.id} {...item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
