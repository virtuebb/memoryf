// theme
import { useTheme } from "../../../shared/components/ThemeContext";

// shared (❌ Home에서는 Header/Sidebar 쓰지 말자고 했지)
 // import Header from "../../../shared/components/Header";
 // import Sidebar from "../../../shared/components/Sidebar";

// story
import Storybar from "../../story/components/Storybar";

// home components
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";


function Home() {
  const { theme } = useTheme();

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
      <div className="home-layout">
        {/* 왼쪽 사이드바 */}
        <aside className="sidebar">
          <Header />
          <Sidebar />
        </aside>

        {/* 가운데 메인 */}
        <main className="main">
          <div className="card">
            <Storybar />
          </div>

          <div className="card">
            <ProfileCard />
          </div>

          <div className="feed-section">
            <FeedTabs />
          </div>
        </main>

        {/* 오른쪽 패널 */}
        <aside className="right">
          <div className="card">
            <Guestbook />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
