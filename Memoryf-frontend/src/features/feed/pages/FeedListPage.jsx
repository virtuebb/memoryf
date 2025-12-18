import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getFeedList } from '../api/feedApi';
import FeedItem from '../components/FeedItem';
import './FeedListPage.css';

// 정렬 옵션 상수 (SOLID: Open/Closed Principle - 확장 가능)
const SORT_OPTIONS = {
  POPULAR: 'popular',
  FOLLOWING: 'following',
  RECENT: 'recent',
};

function FeedListPage({ reloadKey = 0 }) {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
  const location = useLocation();

  // 피드 목록 조회 함수 (useCallback으로 메모이제이션)
  const fetchFeeds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // RESTful API 호출
      const data = await getFeedList(sortBy);
      console.log('피드 목록 조회 결과:', data); // 디버깅용 로그
      // 백엔드 응답이 배열이면 그대로 사용, 아니면 빈 배열
      if (Array.isArray(data)) {
        console.log(`피드 ${data.length}개 조회됨`); // 디버깅용 로그
        setFeeds(data);
      } else {
        console.log('피드 데이터가 배열이 아닙니다:', data); // 디버깅용 로그
        setFeeds([]);
      }
    } catch (err) {
      console.error('피드 조회 오류:', err);
      // 네트워크 오류인 경우 더 명확한 메시지
      if (err.code === 'ERR_NETWORK') {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (http://localhost:8006)');
      } else {
        setError('피드를 불러오는데 실패했습니다.');
      }
      // DB에 데이터가 없거나 API 오류 시 빈 배열로 설정 (Mock 데이터 사용 안 함)
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  // 정렬 옵션 변경 또는 페이지 포커스 시 데이터 다시 가져오기
  useEffect(() => {
    // 피드 목록 페이지일 때만 데이터 가져오기
    if (location.pathname === '/feeds') {
      fetchFeeds();
    }
  }, [sortBy, location.pathname, reloadKey, fetchFeeds]);

  // 다른 컴포넌트(상세/작성 등)에서 피드가 변경되었을 때 재조회
  useEffect(() => {
    const handleFeedChanged = () => {
      if (location.pathname === '/feeds') {
        fetchFeeds();
      }
    };

    window.addEventListener('feedChanged', handleFeedChanged);
    return () => {
      window.removeEventListener('feedChanged', handleFeedChanged);
    };
  }, [location.pathname, fetchFeeds]);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Mock 데이터 함수 제거 (실제 DB 데이터만 사용)

  if (loading) {
    return (
      <div className="feed-list-page">
        <div className="feed-list-header">
          <h1>피드</h1>
        </div>
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error && feeds.length === 0) {
    return (
      <div className="feed-list-page">
        <div className="feed-list-header">
          <h1>피드</h1>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="feed-list-page">
      {/* 헤더 및 정렬 옵션 */}
      <div className="feed-list-header">
        <h1>피드</h1>
        <div className="feed-sort-options">
          <button
            className={`sort-btn ${sortBy === SORT_OPTIONS.POPULAR ? 'active' : ''}`}
            onClick={() => handleSortChange(SORT_OPTIONS.POPULAR)}
          >
            인기순
          </button>
          <button
            className={`sort-btn ${sortBy === SORT_OPTIONS.FOLLOWING ? 'active' : ''}`}
            onClick={() => handleSortChange(SORT_OPTIONS.FOLLOWING)}
          >
            팔로잉
          </button>
          <button
            className={`sort-btn ${sortBy === SORT_OPTIONS.RECENT ? 'active' : ''}`}
            onClick={() => handleSortChange(SORT_OPTIONS.RECENT)}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 3*N 그리드 레이아웃 (인스타그램 스타일) */}
      {feeds.length === 0 ? (
        <div className="feed-empty-state">
          <p>아직 등록된 피드가 없습니다.</p>
          <p>첫 번째 피드를 작성해보세요! 📸</p>
        </div>
      ) : (
        <div className="feed-grid">
          {feeds.map((feed) => (
            <FeedItem key={feed.feedNo} feed={feed} isGrid={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedListPage;
