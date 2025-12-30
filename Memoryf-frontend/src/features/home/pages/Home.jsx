import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { memberNo: memberNoParam, memberNick } = useParams();
  const { theme } = useTheme();
  const [homeNo, setHomeNo] = useState(null);
  const [targetMemberNo, setTargetMemberNo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const currentMemberNo = getMemberNoFromToken();


  /* 홈 정보 조회 */
  useEffect(() => {
    let cancelled = false;

    const fetchHome = async () => {
      try {
        setNotFound(false);
        const parsedMemberNo = memberNoParam ? Number(memberNoParam) : null;

        let homeData = null;
        if (Number.isFinite(parsedMemberNo) && parsedMemberNo > 0) {
          homeData = await getHomeByMemberNo(parsedMemberNo, currentMemberNo);
        } else if (memberNick) {
          homeData = await getHomeByMemberNick(memberNick, currentMemberNo);
        } else if (currentMemberNo) {
          homeData = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        }

        if (cancelled) return;

        // 닉네임 라우트에서 조회 실패하면, 내 홈으로 잘못 폴백하지 않고 notFound 처리
        if (memberNick && !homeData) {
          setHomeNo(null);
          setTargetMemberNo(null);
          setNotFound(true);
          return;
        }

        setHomeNo(homeData?.homeNo ?? null);
        setTargetMemberNo(homeData?.memberNo ?? parsedMemberNo ?? currentMemberNo ?? null);

        if (currentMemberNo && homeData?.homeNo) {
          
          // 방문 기록(실패해도 화면 동작에 영향 없도록)
          recordVisit(currentMemberNo, homeData.homeNo).catch(() => {});
        }
      } catch (error) {
        console.error('홈 번호 조회 실패:', error);
        if (!cancelled) {
          setHomeNo(null);
          setTargetMemberNo(null);
          setNotFound(Boolean(memberNick));
        }
      }
    };

    fetchHome();

    return () => {
      cancelled = true;
    };
  }, [currentMemberNo, memberNick, memberNoParam]);

  const resolvedMemberNo = targetMemberNo ?? currentMemberNo;
  const isOwner =
    resolvedMemberNo != null &&
    currentMemberNo != null &&
    Number(resolvedMemberNo) === Number(currentMemberNo);

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

          {notFound ? (
            <div className="card card-profile">
              <div style={{ padding: 16 }}>
                <strong>해당 사용자를 찾을 수 없습니다.</strong>
              </div>
            </div>
          ) : (
            <>

              <div className="card card-profile">
                <ProfileCard memberNo={resolvedMemberNo} isOwner={isOwner} />
              </div>

              {/* 🔥 핵심: homeNo + 홈 주인 번호 전달 */}
              {homeNo && resolvedMemberNo && (
                <div className="card card-guestbook">
                  <Guestbook homeNo={homeNo} homeOwnerMemberNo={resolvedMemberNo} />
                </div>
              )}

              <div className="feed-section">
                <FeedTabs memberNo={resolvedMemberNo} isOwner={isOwner} onCreateClick={handleCreateClick} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
