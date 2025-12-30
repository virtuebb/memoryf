import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUnreadCount } from '../../features/notification/api/notificationApi';
import { decodeToken } from '../../utils/jwt';
import '../css/Sidebar.css';

function Sidebar({ onCreateClick }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.memberNo) {
        fetchUnreadCount(decoded.memberNo);
      }
    }
  }, [location.pathname]); // Update count on navigation

  const fetchUnreadCount = async (memberNo) => {
    try {
      const response = await getUnreadCount(memberNo);
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  return (
    <nav className="sidebar">
      <ul className="menu-list">
        {/* MAIN */}
        <li className={isActive('/home') ? 'active' : ''}>
          <Link to="/home">
            <span className="icon">🏠</span>
            Home
          </Link>
        </li>

        <li className={isActive('/search') ? 'active' : ''}>
          <Link to="/search">
            <span className="icon">🔍</span>
            Search
          </Link>
        </li>

        {/* CONTENT */}
        <li className="menu-label">CONTENT</li>

        <li className={isActive('/diary') ? 'active' : ''}>
          <Link to="/diary">
            <span className="icon">📔</span>
            Diary
          </Link>
        </li>

        <li className={isActive('/feeds') ? 'active' : ''}>
          <Link to="/feeds">
            <span className="icon">📰</span>
            Feed
          </Link>
        </li>

        <li className={location.pathname.startsWith('/messages') ? 'active' : ''}>
          <Link to="/messages">
            <span className="icon">💬</span>
            DM
          </Link>
        </li>

        <li className={isActive('/notifications') ? 'active' : ''}>
          <Link to="/notifications" className="notification-link">
            <span className="icon">❤️</span>
            Notifications
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>
        </li>

        {/* CREATE */}
        {onCreateClick && (
          <li>
            <button onClick={onCreateClick}>
              <span className="icon">➕</span>
              Post
            </button>
          </li>
        )}

        {/* SYSTEM */}
        <li className="menu-label">SYSTEM</li>

        <li className={location.pathname.startsWith('/settings') ? 'active' : ''}>
            <Link to="/settings/edit">
            <span className="icon">⚙️</span>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
