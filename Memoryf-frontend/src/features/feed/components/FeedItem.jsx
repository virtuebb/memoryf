import { Link, useLocation } from 'react-router-dom';
import './FeedItem.css';

/**
 * FeedItem 컴포넌트 (SOLID: Single Responsibility - 피드 아이템 렌더링만 담당)
 * @param {Object} feed - 피드 데이터
 * @param {boolean} isGrid - 그리드 레이아웃 여부
 */
function FeedItem({ feed, isGrid = true }) {
  const location = useLocation();
  // 피드 이미지 URL 추출 (첫 번째 이미지 사용)
  const getImageUrl = () => {
    if (!feed.feedFiles || feed.feedFiles.length === 0) {
      return 'https://via.placeholder.com/400x400?text=No+Image';
    }
    
    const filePath = feed.feedFiles[0].filePath;
    
    // 절대 URL이면 그대로 사용
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // 상대 경로면 백엔드 서버 URL과 결합
    if (filePath.startsWith('/')) {
      return `http://localhost:8006/memoryf${filePath}`;
    }
    
    // 그 외의 경우 그대로 사용
    return filePath;
  };
  
  const imageUrl = getImageUrl();

  // 그리드 모드: 인스타그램 스타일 (이미지만 표시)
  if (isGrid) {
        return (
          <Link
            to={`/feeds/${feed.feedNo}`}
            state={{ backgroundLocation: location }}
            className="feed-item-grid"
          >
        <div className="feed-image-wrapper">
          <img src={imageUrl} alt={feed.content || '피드 이미지'} className="feed-image" />
          <div className="feed-overlay">
            <div className="feed-stats">
              <span className="feed-stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {feed.likeCount || 0}
              </span>
              <span className="feed-stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {feed.commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default FeedItem;

