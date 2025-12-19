import { useState, useEffect } from "react";
import { useTheme } from "../../../shared/components/ThemeContext";
import { getHomeByMemberNo, getHomeByMemberNick } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import { recordVisit } from "../../../shared/api/visitorApi";

import Storybar from "../../story/components/Storybar";
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";

function Home() {
  const targetMemberNo = null;
  const { theme } = useTheme();
  const [homeNo, setHomeNo] = useState(null);
  const currentMemberNo = getMemberNoFromToken();

  /* 홈 정보 조회 */
  useEffect(() => {
    if (!targetMemberNo) return;

    const fetchHome = async () => {
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

          {/* 🔥 핵심: homeNo + 홈 주인 번호 전달 */}
          {homeNo && (
            <div className="card card-guestbook">
              <Guestbook
                homeNo={homeNo}
                homeOwnerMemberNo={targetMemberNo}
              />
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
