import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { getMemberNoFromToken } from "../../shared/lib";
import { getVisitorStats } from "../../entities/visitor";

// 공통
import { BgmPlayer, Visitors, SkinButton, Header, Sidebar, Footer } from "../../widgets";

// 홈
import Home from "../../pages/home/Home";

// 일반 사용자
import SearchPage from "../../pages/search/SearchPage";
import FeedListPage from "../../pages/feed/FeedListPage";
import FeedDetailPage from "../../pages/feed/FeedDetailPage";
import { FeedUploadModal } from "../../features/feed";
import SettingsPage from "../../pages/settings/SettingsPage";
import DmRoutes from "../../pages/dm/DmRoutes";
import { FloatingDm, ChatRoom as DmRoom } from "../../features/dm";
import DiaryPage from "../../pages/diary/DiaryPage";
import NotificationPage from "../../pages/notification/NotificationPage";

// 스토리
import StoryUploadPage from "../../pages/story/StoryUploadPage";

// 결제 (포인트 충전, BGM 구매)
import PointChargePage from "../../pages/payment/PointChargePage";
import BgmStorePage from "../../pages/payment/BgmStorePage";

// 지도
import MapTestPage from "../../pages/map/MapTestPage";

export default function UserApp() {
  const [visitorStats, setVisitorStats] = useState({ today: 0, total: 0 });
  const [activeHomeMemberNo, setActiveHomeMemberNo] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null); // 수정할 피드 데이터
  const [feedReloadKey, setFeedReloadKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const currentMemberNo = getMemberNoFromToken();

  const homeMemberNo = (() => {
    if (location.pathname.startsWith("/home/")) {
      return Number(location.pathname.split("/")[2]);
    }
    if (location.pathname === "/home") {
      return currentMemberNo;
    }
    return null;
  })();

  useEffect(() => {
    if (location.pathname === "/home" && currentMemberNo) {
      setActiveHomeMemberNo(currentMemberNo);
    }

    if (location.pathname.startsWith("/home/")) {
      const no = Number(location.pathname.split("/")[2]);
      if (!isNaN(no)) setActiveHomeMemberNo(no);
    }
  }, [location.pathname, currentMemberNo]);

  // ✅ activeHomeMemberNo 기준으로 방문자 조회
  useEffect(() => {
    if (!activeHomeMemberNo) return;

    getVisitorStats(activeHomeMemberNo)
      .then((res) => {
        setVisitorStats({
          today: res.data?.today ?? 0,
          total: res.data?.total ?? 0,
        });
      })
      .catch(() => {
        setVisitorStats({ today: 0, total: 0 });
      });
  }, [activeHomeMemberNo]);

  // 설정 페이지 여부
  const isSettings = location.pathname.startsWith("/settings");

  // openFeedModal 이벤트 리스너 등록
  useEffect(() => {
    const handleOpenFeedModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("openFeedModal", handleOpenFeedModal);

    return () => {
      window.removeEventListener("openFeedModal", handleOpenFeedModal);
    };
  }, []);

  return (
    <div className="app-root">
      <div className="app-scroll">
        <div className={`main-layout ${isSettings ? "settings-mode" : ""}`}>
          <aside className="left-column">
            {/* 1. 로고 */}
            <Header />

            {/* 2. BGM 플레이어 */}
            <div className="sidebar-section card">
              <BgmPlayer />
            </div>

            {/* 3. 메뉴 */}
            <Sidebar onCreateClick={() => setIsModalOpen(true)} />

            {/* 4. 방문자 */}
            <div className="sidebar-section card">
              <Visitors today={visitorStats.today} total={visitorStats.total} />
            </div>

            {/* 5. 테마 버튼 */}
            <div className="sidebar-section card">
              <SkinButton />
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className={`main-content ${isSettings ? "settings-mode" : ""}`}>
            <Routes location={backgroundLocation || location}>
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* 🔥 지도 테스트 */}
              <Route path="/map-test" element={<MapTestPage />} />

              {/* 홈 */}
              <Route path="/home" element={<Home />} />
              <Route path="/home/:memberNo" element={<Home />} />
              <Route path="/:memberNick" element={<Home />} />

              {/* 기타 */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/feeds" element={<FeedListPage reloadKey={feedReloadKey} />} />
              <Route path="/messages/*" element={<DmRoutes />} />

              {/* 채팅 테스트 주소 */}
              <Route path="/chat-test" element={<DmRoom />} />

              <Route path="/settings/*" element={<SettingsPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/notifications" element={<NotificationPage />} />

              {/* 결제 */}
              <Route path="/payment/charge" element={<PointChargePage />} />
              <Route path="/payment/bgm" element={<BgmStorePage />} />

              <Route path="*" element={<Navigate to="/home" replace />} />

              {/* 스토리 */}
              <Route path="/story/upload" element={<StoryUploadPage />} />
            </Routes>

            {/* 🔥 피드 상세 모달 라우트 */}
            {backgroundLocation && (
              <Routes>
                <Route
                  path="/feeds/:feedNo"
                  element={
                    <FeedDetailPage
                      isModal
                      onEditFeed={(feed) => {
                        setEditingFeed(feed);
                        setIsModalOpen(true);
                      }}
                    />
                  }
                />
              </Routes>
            )}
          </main>
        </div>

        <Footer />

        <FeedUploadModal
          isOpen={isModalOpen}
          mode={editingFeed ? "edit" : "create"}
          initialFeed={editingFeed}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFeed(null);
          }}
          onSuccess={() => {
            const wasEditMode = !!editingFeed;
            setIsModalOpen(false);
            setEditingFeed(null);
            setFeedReloadKey((prev) => prev + 1);
            window.dispatchEvent(new Event("feedChanged"));
            if (!wasEditMode) {
              navigate("/feeds");
            }
          }}
        />

        {/* 플로팅 DM (PIP 스타일 - 모든 페이지에서 사용 가능) */}
        <FloatingDm />
      </div>
    </div>
  );
}
