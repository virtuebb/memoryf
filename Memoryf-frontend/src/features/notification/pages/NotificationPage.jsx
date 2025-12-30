import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { getNotifications, markAsRead, deleteNotification, acceptFollowRequest, rejectFollowRequest } from '../api/notificationApi';
import { decodeToken } from '../../../utils/jwt';
import defaultProfileImg from '../../../assets/images/profiles/default-profile.svg';
import '../css/NotificationPage.css';

dayjs.extend(relativeTime);
dayjs.locale('ko');

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [memberNo, setMemberNo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const markReadLocally = (notificationNo) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationNo === notificationNo ? { ...n, isRead: 'Y' } : n
      )
    );
  };

  const ensureMarkedAsRead = async (noti) => {
    if (noti.isRead === 'N') {
      await markAsRead(noti.notificationNo);
      markReadLocally(noti.notificationNo);
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

  const handleGoProfile = async (noti) => {
    await ensureMarkedAsRead(noti);
    navigate(`/${noti.senderNick}`);
  };

  const handleGoFeed = async (noti) => {
    await ensureMarkedAsRead(noti);
    navigate(`/feeds/${noti.targetId}`, { state: { backgroundLocation: location } });
  };

  const handleGoHome = async (noti) => {
    await ensureMarkedAsRead(noti);
    navigate(`/${noti.senderNick}`);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const parsed = dayjs(dateString);
    if (!parsed.isValid()) return '';

    const now = dayjs();
    const diffMinutes = Math.max(0, now.diff(parsed, 'minute'));
    const diffHours = Math.max(0, now.diff(parsed, 'hour'));
    const diffDays = Math.max(0, now.diff(parsed, 'day'));

    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes}분`;
    if (diffHours < 24) return `${diffHours}시간`;
    if (diffDays < 7) return `${diffDays}일`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주`;

    const diffMonths = Math.max(0, now.diff(parsed, 'month'));
    if (diffMonths < 12) return `${diffMonths}개월`;

    const diffYears = Math.max(0, now.diff(parsed, 'year'));
    return `${diffYears}년`;
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
              <div className="noti-content">
                <img 
                    src={(noti.senderProfile && noti.senderStatus !== 'Y') ? `http://localhost:8006/memoryf/profile_images/${noti.senderProfile}` : defaultProfileImg} 
                    alt="profile" 
                    className="noti-profile-img"
                    onError={(e) => {e.target.src = defaultProfileImg}}
                    onClick={() => noti.senderStatus !== 'Y' && handleGoProfile(noti)}
                    style={{ cursor: noti.senderStatus === 'Y' ? 'default' : 'pointer' }}
                />
                <div className="noti-text">
                  <button
                    type="button"
                    className="noti-user"
                    onClick={() => noti.senderStatus !== 'Y' && handleGoProfile(noti)}
                    style={{ cursor: noti.senderStatus === 'Y' ? 'default' : 'pointer' }}
                  >
                    {noti.senderStatus === 'Y' ? 'deletedUser' : noti.senderNick}
                  </button>
                  {noti.type === 'FOLLOW_REQUEST' && "님이 팔로우를 요청했습니다."}
                  {noti.type === 'FOLLOW_ACCEPT' && "님이 팔로우 요청을 수락했습니다."}
                  {noti.type === 'FOLLOW' && "님이 회원님을 팔로우하기 시작했습니다."}
                  {noti.type === 'LIKE_FEED' && "님이 회원님의 게시물을 좋아합니다."}
                  {noti.type === 'COMMENT_FEED' && "님이 댓글을 남겼습니다."}
                  {noti.type === 'GUESTBOOK' && (
                    <>
                      님이 회원님의{" "}
                      <button
                        type="button"
                        className="noti-link"
                        onClick={() => handleGoHome(noti)}
                      >
                        홈
                      </button>
                      에 방명록을 남겼습니다.
                    </>
                  )}
                  <span className="noti-date">{formatTimeAgo(noti.createDate)}</span>
                </div>
                {noti.feedImage && (
                  (() => {
                    const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(
                      noti.feedImage.split('.').pop()?.toLowerCase()
                    );
                    
                    return isVideo ? (
                      <video
                        src={`http://localhost:8006/memoryf/feed_upfiles/${noti.feedImage}#t=1.0`}
                        className="noti-feed-img"
                        muted
                        preload="metadata"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGoFeed(noti);
                        }}
                      />
                    ) : (
                      <img
                        src={`http://localhost:8006/memoryf/feed_upfiles/${noti.feedImage}`}
                        alt="feed"
                        className="noti-feed-img"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGoFeed(noti);
                        }}
                        onError={(e) => {
                          e.target.src = '/default-feed.png';
                        }}
                      />
                    );
                  })()
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
