import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFeedDetail } from '../api/feedApi';
import FeedItem from '../components/FeedItem';
import './FeedDetailPage.css';
import './FeedDetailPage.css';

function FeedDetailPage({ isModal = false }) {
  const { feedNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeedDetail(feedNo);
        setFeed(data);
      } catch (err) {
        console.error('피드 상세 조회 오류:', err);
        setError('피드를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (feedNo) {
      fetchFeed();
    }
  }, [feedNo]);

  const handleClose = () => {
    if (isModal) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        <div className="error">{error || '피드를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className={isModal ? 'feed-modal-overlay' : ''}>
      <div className={`feed-detail-page ${isModal ? 'modal' : ''}`}>
        {isModal && (
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        )}
        <FeedItem feed={feed} isGrid={false} />
      </div>
    </div>
  );
}

export default FeedDetailPage;

