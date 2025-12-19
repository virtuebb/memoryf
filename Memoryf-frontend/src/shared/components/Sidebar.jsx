import { Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

function Sidebar({ onCreateClick }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

        <li>
          <span>
            <span className="icon">🖼</span>
            Album
          </span>
        </li>

        {/* SYSTEM */}
        <li className="menu-label">SYSTEM</li>

        <li className={location.pathname.startsWith('/settings') ? 'active' : ''}>
          <Link to="/settings">
            <span className="icon">⚙️</span>
            Settings
          </Link>
        </li>

        {/* CREATE */}
        {onCreateClick && (
          <li className="create">
            <button onClick={onCreateClick}>
              😀 피드 작성
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
