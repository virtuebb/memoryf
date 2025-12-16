// theme context (같은 폴더)
import { useTheme } from "./ThemeContext";

// shared header
import Header from "../../../shared/components/Header";

// main feature components
import StoryBar from "../../story/components/Storybar";
import ProfileCard from "../../main/components/ProfileCard";
import Guestbook from "../../main/components/Guestbook";
import FeedTabs from "../../main/components/FeedTabs";

import "../css/Home.css";

function Home() {
  const { theme } = useTheme();

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
      <div className="home-layout">
        {/* 사이드바 */}
        <aside className="sidebar">
          <Header />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="right">
          <div className="right-stack">
            <div className="card">
              <StoryBar />
            </div>

            <div className="card">
              <ProfileCard />
            </div>

            <div className="card">
              <Guestbook />
            </div>

            <div className="feed-section">
              <FeedTabs />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
