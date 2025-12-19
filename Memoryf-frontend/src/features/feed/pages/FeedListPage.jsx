import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();

  const loadMoreRef = useRef(null);
  const PAGE_SIZE = 18;

  // 피드 목록 조회 함수 (useCallback으로 메모이제이션)
  const fetchFeeds = useCallback(async ({ nextPage, append }) => {
    try {
      setError(null);
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await getFeedList(sortBy, nextPage, PAGE_SIZE);

      const list = Array.isArray(data) ? data : [];
      setFeeds((prev) => (append ? [...prev, ...list] : list));
      setPage(nextPage);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err) {
      console.error('피드 조회 오류:', err);
      // 네트워크 오류인 경우 더 명확한 메시지
      if (err.code === 'ERR_NETWORK') {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (http://localhost:8006)');
      } else {
        setError('피드를 불러오는데 실패했습니다.');
      }
      if (!append) {
        setFeeds([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sortBy]);

  // 정렬 옵션 변경 또는 페이지 포커스 시 데이터 다시 가져오기
  useEffect(() => {
    // 피드 목록 페이지일 때만 데이터 가져오기
    if (location.pathname === '/feeds') {
      setFeeds([]);
      setPage(0);
      setHasMore(true);
      fetchFeeds({ nextPage: 0, append: false });
    }
  }, [sortBy, location.pathname, reloadKey, fetchFeeds]);

  // 다른 컴포넌트(상세/작성 등)에서 피드가 변경되었을 때 재조회
  useEffect(() => {
    const handleFeedChanged = () => {
      if (location.pathname === '/feeds') {
        setFeeds([]);
        setPage(0);
        setHasMore(true);
        fetchFeeds({ nextPage: 0, append: false });
      }
    };

    window.addEventListener('feedChanged', handleFeedChanged);
    return () => {
      window.removeEventListener('feedChanged', handleFeedChanged);
    };
  }, [location.pathname, fetchFeeds]);

  // 무한 스크롤: 하단 sentinel이 보이면 다음 페이지 로드
  useEffect(() => {
    if (location.pathname !== '/feeds') return;
    if (!hasMore) return;
    if (loading || loadingMore) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          fetchFeeds({ nextPage: page + 1, append: true });
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [location.pathname, hasMore, loading, loadingMore, page, fetchFeeds]);

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
        <>
          <div className="feed-grid">
            {feeds.map((feed) => (
              <FeedItem key={feed.feedNo} feed={feed} isGrid={true} />
            ))}
          </div>

          <div ref={loadMoreRef} className="feed-load-more">
            {loadingMore ? '로딩 중…' : hasMore ? '' : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default FeedListPage;
