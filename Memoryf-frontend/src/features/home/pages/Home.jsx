import { useState, useEffect } from "react";
import { useTheme } from "../../../shared/components/ThemeContext";
import { getHomeByMemberNo } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";

import Storybar from "../../story/components/Storybar";
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";

function Home() {
  const { theme } = useTheme();
  const [homeNo, setHomeNo] = useState(null);
  const currentMemberNo = getMemberNoFromToken();

  useEffect(() => {
    const fetchHomeNo = async () => {
      if (!currentMemberNo) return;
      
      try {
        const homeData = await getHomeByMemberNo(currentMemberNo);
        if (homeData) {
          setHomeNo(homeData.homeNo);
        }
      } catch (error) {
        console.error('홈 번호 조회 실패:', error);
      }
    };

    fetchHomeNo();
  }, [currentMemberNo]);

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

          {homeNo && (
            <div className="card card-guestbook">
              <Guestbook homeNo={homeNo} />
            </div>
          )}

          <div className="feed-section">
            <FeedTabs />
          </div>
        </main> 
      </div>
    </div>
  );
}

export default Home;
