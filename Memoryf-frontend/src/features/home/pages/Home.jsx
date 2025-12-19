import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../shared/components/ThemeContext";
import { getHomeByMemberNo } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import { recordVisit } from "../../../shared/api/visitorApi";

import Storybar from "../../story/components/Storybar";
import ProfileCard from "../components/ProfileCard";
import Guestbook from "../components/Guestbook";
import FeedTabs from "../components/FeedTabs";

import "../css/Home.css";

function Home() {
  const { theme } = useTheme();
  const { memberNo } = useParams();
  const loginMemberNo = getMemberNoFromToken();

  const targetMemberNo = memberNo
    ? Number(memberNo)
    : loginMemberNo;

  const [homeNo, setHomeNo] = useState(null);
  const hasRecordedRef = useRef(false);

  /* 홈 정보 조회 */
  useEffect(() => {
    if (!targetMemberNo) return;

    const fetchHome = async () => {
      try {
        const homeData = await getHomeByMemberNo(
          targetMemberNo,
          loginMemberNo
        );

        console.log("🏠 Home data:", homeData);

        if (homeData && homeData.homeNo) {
          setHomeNo(Number(homeData.homeNo));
        } else {
          console.warn("⚠️ homeNo 없음", homeData);
          setHomeNo(null);
        }
      } catch (e) {
        console.error("홈 정보 조회 실패", e);
      }
    };

    fetchHome();
  }, [targetMemberNo, loginMemberNo]);

  /* 방문 기록 (🔥 단 1회만) */
  useEffect(() => {
    if (!loginMemberNo || !homeNo) return;
    if (loginMemberNo === targetMemberNo) return;
    if (hasRecordedRef.current) return;

    hasRecordedRef.current = true;

    recordVisit(loginMemberNo, homeNo).catch(() => {
      console.warn("방문 기록 실패 (이미 기록됨)");
    });
  }, [loginMemberNo, targetMemberNo, homeNo]);

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
      <div className="home-layout">
        <main className="main">
          <div className="card card-story">
            <Storybar />
          </div>

          <div className="card card-profile">
            <ProfileCard memberNo={targetMemberNo} />
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
            <FeedTabs memberNo={targetMemberNo} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
