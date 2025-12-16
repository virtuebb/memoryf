import { useTheme } from "../../../shared/components/ThemeContext";

import Storybar from "../../story/components/Storybar";
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";

function Home() {
  const { theme } = useTheme();

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
      <div className="home-layout">
        <main className="main">
          <div className="card card-story">
            <Storybar />
          </div>

          <div className="card card-profile">
            <ProfileCard />
          </div>

          <div className="card card-guestbook">
            <Guestbook />
          </div>

          <div className="feed-section">
            <FeedTabs />
          </div>
        </main> 
      </div>
    </div>
  );
}

export default Home;
