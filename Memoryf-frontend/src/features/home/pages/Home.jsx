import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../shared/components/ThemeContext";
import { getHomeByMemberNo, getHomeByMemberNick } from "../api/homeApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import { onFollowChange } from "../../../utils/followEvents";
import { visitHome } from "../../../shared/api/visitorApi";

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
  const [homeData, setHomeData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const currentMemberNo = getMemberNoFromToken();


  /* 홈 정보 조회 */
  useEffect(() => {
    let cancelled = false;

    const fetchHome = async () => {
      try {
        setNotFound(false);
        const parsedMemberNo = memberNoParam ? Number(memberNoParam) : null;

        let data = null;
        if (Number.isFinite(parsedMemberNo) && parsedMemberNo > 0) {
          data = await getHomeByMemberNo(parsedMemberNo, currentMemberNo);
        } else if (memberNick) {
          data = await getHomeByMemberNick(memberNick, currentMemberNo);
        } else if (currentMemberNo) {
          data = await getHomeByMemberNo(currentMemberNo, currentMemberNo);
        }

        if (cancelled) return;

        // 닉네임 라우트에서 조회 실패하면, 내 홈으로 잘못 폴백하지 않고 notFound 처리
        if (memberNick && !data) {
          setHomeNo(null);
          setTargetMemberNo(null);
          setHomeData(null);
          setNotFound(true);
          return;
        }

        setHomeData(data);
        setHomeNo(data?.homeNo ?? null);
        setTargetMemberNo(data?.memberNo ?? parsedMemberNo ?? currentMemberNo ?? null);

      } catch (error) {
        console.error('홈 번호 조회 실패:', error);
        if (!cancelled) {
          setHomeNo(null);
          setTargetMemberNo(null);
          setHomeData(null);
          setNotFound(Boolean(memberNick));
        }
      }
    };

    fetchHome();

    return () => {
      cancelled = true;
    };
  }, [currentMemberNo, memberNick, memberNoParam]);

  useEffect(() => {

  if (!homeNo) return;
      visitHome(homeNo); // ✅ 방문 기록만 남김
    }, [homeNo]);

  // 팔로우/언팔로우가 모달(피드상세) 등 다른 화면에서 발생해도
  // 홈 화면이 새로고침 없이 즉시 반영되도록 이벤트로 동기화
  useEffect(() => {
    if (!currentMemberNo) return;

    return onFollowChange(({ targetMemberNo, actorMemberNo, status }) => {
      if (!targetMemberNo || !actorMemberNo) return;
      if (Number(actorMemberNo) !== Number(currentMemberNo)) return;

      setHomeData((prev) => {
        if (!prev) return prev;
        if (Number(prev.memberNo) !== Number(targetMemberNo)) return prev;

        const nextStatus = status ?? null; // 'Y' | 'P' | null
        const nextIsFollowing = nextStatus === 'Y' || nextStatus === 'P';

        // 이미 동일한 상태면 불필요한 재렌더/카운트 변형 방지
        if ((prev.followStatus ?? null) === nextStatus && Boolean(prev.isFollowing) === nextIsFollowing) {
          return prev;
        }

        const prevCount = Number(prev.followerCount ?? 0);
        let nextCount = prevCount;
        if (prev.followStatus === 'Y' && nextStatus !== 'Y') {
          nextCount = Math.max(0, prevCount - 1);
        } else if (prev.followStatus !== 'Y' && nextStatus === 'Y') {
          nextCount = prevCount + 1;
        }

        return {
          ...prev,
          followStatus: nextStatus,
          isFollowing: nextIsFollowing,
          followerCount: nextCount,
        };
      });
    });
  }, [currentMemberNo]);

  const resolvedMemberNo = targetMemberNo ?? currentMemberNo;
  const isOwner =
    resolvedMemberNo != null &&
    currentMemberNo != null &&
    Number(resolvedMemberNo) === Number(currentMemberNo);

  const isPrivate = homeData?.isPrivateProfile === 'Y';
  // boolean 타입으로 오므로 true/false 체크, 그리고 followStatus가 'Y'여야 실제로 볼 수 있음
  const isFollowing = homeData?.isFollowing === true; 
  const isFollowAccepted = homeData?.followStatus === 'Y';
  
  // 본인이거나, 공개 계정이거나, 팔로우가 승인된 상태여야 함
  const canView = isOwner || !isPrivate || (isFollowing && isFollowAccepted);

  const handleCreateClick = () => {
    window.dispatchEvent(new Event('openFeedModal'));
  };

  return (
    <div className="home-wrapper" style={{ background: theme.color }}>
    <div className="home-scroll">
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

              {canView ? (
                <>
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
              ) : (
                <div className="card private-account-msg" style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="lock-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                  <h3 style={{ margin: '0 0 8px 0' }}>비공개 계정입니다</h3>
                  <p style={{ color: '#888', margin: 0 }}>사진과 동영상을 보려면 팔로우하세요.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  </div>
  );
}

export default Home;
