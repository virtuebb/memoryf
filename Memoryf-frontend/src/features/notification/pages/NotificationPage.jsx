import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, deleteNotification, acceptFollowRequest, rejectFollowRequest } from '../api/notificationApi';
import { decodeToken } from '../../../utils/jwt';
import '../css/NotificationPage.css';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [memberNo, setMemberNo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.memberNo) {
        setMemberNo(decoded.memberNo);
        fetchNotifications(decoded.memberNo);
      }
    }
  }, []);

  const fetchNotifications = async (mNo) => {
    try {
      const response = await getNotifications(mNo);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleAccept = async (noti) => {
    try {
      const response = await acceptFollowRequest(noti.senderNo, memberNo);
      if (response.success) {
        // 알림 삭제 또는 상태 변경
        await deleteNotification(noti.notificationNo);
        fetchNotifications(memberNo);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Failed to accept follow:", error);
    }
  };

  const handleReject = async (noti) => {
    try {
      const response = await rejectFollowRequest(noti.senderNo, memberNo);
      if (response.success) {
        await deleteNotification(noti.notificationNo);
        fetchNotifications(memberNo);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Failed to reject follow:", error);
    }
  };

  const openDeleteSheet = (noti) => {
    setDeleteTarget(noti);
  };

  const closeDeleteSheet = () => {
    setDeleteTarget(null);
  };

  const confirmDeleteNotification = async () => {
    if (!deleteTarget?.notificationNo) return;

    try {
      const response = await deleteNotification(deleteTarget.notificationNo);
      if (response?.success) {
        closeDeleteSheet();
        fetchNotifications(memberNo);
      } else {
        alert(response?.message || '알림 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      alert('알림 삭제에 실패했습니다.');
    }
  };

  const handleNotificationClick = async (noti) => {
    if (noti.isRead === 'N') {
      await markAsRead(noti.notificationNo);
    }
    
    if (noti.type === 'LIKE_FEED' || noti.type === 'COMMENT_FEED') {
      // 해당 피드로 이동 (구현 필요)
      // navigate(`/feed/${noti.targetId}`);
    } else if (noti.type === 'FOLLOW' || noti.type === 'FOLLOW_ACCEPT') {
      navigate(`/home/${noti.senderNo}`);
    }
  };

  return (
    <div className="notification-container">
      <h2>알림</h2>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">새로운 알림이 없습니다.</p>
        ) : (
          notifications.map(noti => (
            <div key={noti.notificationNo} className={`notification-item ${noti.isRead === 'N' ? 'unread' : ''}`}>
              <div className="noti-content" onClick={() => handleNotificationClick(noti)}>
                <img 
                    src={noti.senderProfile ? `http://localhost:8006/memoryf/profile_images/${noti.senderProfile}` : '/default-profile.png'} 
                    alt="profile" 
                    className="noti-profile-img"
                    onError={(e) => {e.target.src = '/default-profile.png'}}
                />
                <div className="noti-text">
                  <span className="noti-user">{noti.senderNick}</span>
                  {noti.type === 'FOLLOW_REQUEST' && "님이 팔로우를 요청했습니다."}
                  {noti.type === 'FOLLOW_ACCEPT' && "님이 팔로우 요청을 수락했습니다."}
                  {noti.type === 'FOLLOW' && "님이 회원님을 팔로우하기 시작했습니다."}
                  {noti.type === 'LIKE_FEED' && "님이 회원님의 게시물을 좋아합니다."}
                  {noti.type === 'COMMENT_FEED' && "님이 댓글을 남겼습니다."}
                  <span className="noti-date">{new Date(noti.createDate).toLocaleDateString()}</span>
                </div>
                {noti.feedImage && (
                    <img src={`http://localhost:8006/memoryf/feed_images/${noti.feedImage}`} alt="feed" className="noti-feed-img" />
                )}
              </div>
              
              {noti.type === 'FOLLOW_REQUEST' && (
                <div className="noti-actions">
                  <button className="btn-accept" onClick={() => handleAccept(noti)}>수락</button>
                  <button className="btn-reject" onClick={() => handleReject(noti)}>거절</button>
                </div>
              )}

              {/* 인스타처럼: 알림 삭제 액션시트 */}
              <button
                type="button"
                className="noti-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteSheet(noti);
                }}
                aria-label="알림 옵션"
                title="옵션"
              >
                ⋯
              </button>
            </div>
          ))
        )}
      </div>

      {deleteTarget && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="noti-sheet-overlay"
              role="presentation"
              onClick={closeDeleteSheet}
            >
              <div
                className="noti-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="알림 삭제"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="noti-sheet-btn danger"
                  onClick={confirmDeleteNotification}
                >
                  알림 삭제
                </button>
                <button
                  type="button"
                  className="noti-sheet-btn"
                  onClick={closeDeleteSheet}
                >
                  취소
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default NotificationPage;
