import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../shared/components/ThemeContext";
import { getHomeByMemberNo, getHomeByMemberNick } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";

import Storybar from "../../story/components/Storybar";
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";

function Home() {
  const { theme } = useTheme();
  const { memberNick } = useParams();
  const [homeNo, setHomeNo] = useState(null);
  const [targetMemberNo, setTargetMemberNo] = useState(null);
  const currentMemberNo = getMemberNoFromToken();

  const isOwner = !!currentMemberNo && !!targetMemberNo && currentMemberNo === targetMemberNo;

  useEffect(() => {
    const fetchHomeNo = async () => {
      if (!currentMemberNo) return;
      
      try {
        const homeData = memberNick
          ? await getHomeByMemberNick(memberNick, currentMemberNo)
          : await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        if (homeData) {
          setHomeNo(homeData.homeNo);
          setTargetMemberNo(homeData.memberNo);
        }
      } catch (error) {
        console.error('홈 번호 조회 실패:', error);
      }
    };

    fetchHomeNo();
  }, [currentMemberNo, memberNick]);

  // 피드 생성 모달 열기 (App.jsx에서 이벤트 수신)
  const handleCreateClick = () => {
    window.dispatchEvent(new Event('openFeedModal'));
  };

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
      <div className="home-layout">
        <main className="main">
          <div className="card card-story">
            <Storybar />
          </div>

          <div className="card card-profile">
            <ProfileCard memberNo={targetMemberNo} isOwner={isOwner} />
          </div>

          {homeNo && (
            <div className="card card-guestbook">
              <Guestbook homeNo={homeNo} />
            </div>
          )}

          <div className="feed-section">
            <FeedTabs memberNo={targetMemberNo} isOwner={isOwner} onCreateClick={handleCreateClick} />
          </div>
        </main> 
      </div>
    </div>
  );
}

export default Home;
