import { useState } from "react";
import "../css/FeedTabs.css";

// 14개 더미 데이터
const FEEDS = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/400/400?random=${i + 1}`,
  text: `Pastel moment #${i + 1}`,
}));

const BOOKMARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/400/400?random=${i + 20}`,
  text: `Saved mood #${i + 1}`,
}));

const DIARIES = [
  {
    id: 1,
    text: "Today felt soft and quiet. I liked the slow pace.",
    private: true,
  },
  {
    id: 2,
    text: "I want to keep moments like this close to my heart.",
    private: true,
  },
  {
    id: 3,
    text: "Creating warm things makes me feel alive.",
    private: true,
  },
];

function FeedTabs() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <section className="feed-tabs">
      {/* 탭 */}
      <div className="tab-header">
        <button
          className={activeTab === "feed" ? "active" : ""}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
        <button
          className={activeTab === "diary" ? "active" : ""}
          onClick={() => setActiveTab("diary")}
        >
          Diary
        </button>
        <button
          className={activeTab === "bookmark" ? "active" : ""}
          onClick={() => setActiveTab("bookmark")}
        >
          Bookmark
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="tab-content">
        {activeTab === "feed" && (
          <div className="grid">
            {FEEDS.map((item) => (
              <div key={item.id} className="grid-card">
                <img src={item.image} alt="" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "bookmark" && (
          <div className="grid">
            {BOOKMARKS.map((item) => (
              <div key={item.id} className="grid-card">
                <img src={item.image} alt="" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "diary" && (
          <div className="diary-wrap">
            {DIARIES.map((item) => (
              <div key={item.id} className="diary-card">
                <span className="lock">🔒 Private</span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div> {/* ✅ 이 div가 빠져 있었음 */}
    </section>
  );
}

export default FeedTabs;
