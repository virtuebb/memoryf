import { useState, useEffect } from "react";
// FeedTabs component
import { useNavigate, useLocation } from "react-router-dom";
import { getBookmarkedFeedList, getFeedListByMember } from "../../feed/api/feedApi";
import { getMemberNoFromToken } from "../../../utils/jwt";
import "../css/FeedTabs.css";

function FeedTabs({ memberNo, isOwner, onCreateClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("feed");
  const [myFeeds, setMyFeeds] = useState([]);
  const [bookmarkedFeeds, setBookmarkedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentMemberNo = getMemberNoFromToken();

  useEffect(() => {
    fetchFeeds();
    
    // 피드 변경 이벤트 리스너 등록
    const handleFeedChanged = () => {
      fetchFeeds();
    };
    window.addEventListener('feedChanged', handleFeedChanged);
    
    return () => {
      window.removeEventListener('feedChanged', handleFeedChanged);
    };
  }, [currentMemberNo, memberNo]);

  const fetchFeeds = async () => {
    if (!currentMemberNo || !memberNo) {
      setMyFeeds([]);
      setBookmarkedFeeds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 프로필(작성자) 기준 피드 목록을 백엔드에서 직접 조회
      const feeds = await getFeedListByMember(Number(memberNo), Number(currentMemberNo), 0, 60);
      setMyFeeds(Array.isArray(feeds) ? feeds : []);
      // ⚠️ 북마크는 별도 요청이 느리거나 실패해도, 메인 탭 로딩을 막지 않도록 분리
      setBookmarkedFeeds([]);
    } catch (error) {
      console.error('피드 조회 실패:', error);
      setMyFeeds([]);
      setBookmarkedFeeds([]);
    } finally {
      setLoading(false);
    }

    if (!isOwner) return;

    getBookmarkedFeedList(currentMemberNo)
      .then((bookmarked) => {
        setBookmarkedFeeds(Array.isArray(bookmarked) ? bookmarked : []);
      })
      .catch((error) => {
        console.error('북마크 피드 조회 실패:', error);
        setBookmarkedFeeds([]);
      });
  };

  const handleFeedClick = (feedNo) => {
    navigate(`/feeds/${feedNo}`, { state: { backgroundLocation: location } });
  };

  const getImageUrl = (feed) => {
    if (feed.feedFiles && feed.feedFiles.length > 0) {
      return `http://localhost:8006/memoryf${feed.feedFiles[0].filePath}`;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  if (loading) {
    return (
      <section className="feed-tabs">
        <div className="feed-tabs-loading">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="feed-tabs">
      {/* 탭 */}
      <div className="tab-header">
        <button
          className={activeTab === "feed" ? "active" : ""}
          onClick={() => setActiveTab("feed")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
          <span>게시물</span>
        </button>
        {isOwner && (
          <button
            className={activeTab === "bookmark" ? "active" : ""}
            onClick={() => setActiveTab("bookmark")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>저장됨</span>
          </button>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="tab-content">
        {activeTab === "feed" && (
          <div className="grid">
            {myFeeds.length === 0 ? (
              <div className="empty-state">
                <p>아직 게시물이 없습니다</p>
                {isOwner && (
                  <button onClick={onCreateClick}>
                    첫 게시물 만들기
                  </button>
                )}
              </div>
            ) : (
              myFeeds.map((feed) => (
                <div 
                  key={feed.feedNo} 
                  className="grid-card"
                  onClick={() => handleFeedClick(feed.feedNo)}
                >
                  <img src={getImageUrl(feed)} alt={feed.content || ''} />
                  <div className="grid-card-overlay">
                    <span>❤️ {feed.likeCount || 0}</span>
                    <span>💬 {feed.commentCount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {isOwner && activeTab === "bookmark" && (
          <div className="grid">
            {bookmarkedFeeds.length === 0 ? (
              <div className="empty-state">
                <p>저장한 게시물이 없습니다</p>
              </div>
            ) : (
              bookmarkedFeeds.map((feed) => (
                <div 
                  key={feed.feedNo} 
                  className="grid-card"
                  onClick={() => handleFeedClick(feed.feedNo)}
                >
                  <img src={getImageUrl(feed)} alt={feed.content || ''} />
                  <div className="grid-card-overlay">
                    <span>❤️ {feed.likeCount || 0}</span>
                    <span>💬 {feed.commentCount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeedTabs;
