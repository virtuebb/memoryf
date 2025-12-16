import { Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

function Sidebar({ onCreateClick }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <ul className="menu-list">
        <li className={isActive('/home') ? 'active' : ''}>
          <Link to="/home">🏠 Home</Link>
        </li>

        <li className={isActive('/diaries') ? 'active' : ''}>
          <Link to="/diaries">📔 Diary</Link>
        </li>

        <li className={isActive('/feeds') ? 'active' : ''}>
          <Link to="/feeds">📰 Feed</Link>
        </li>

        <li className={location.pathname.startsWith('/messages') ? 'active' : ''}>
          <Link to="/messages">💬 DM</Link>
        </li>

        <li>
          <span>🖼 Album</span>
        </li>

        <li className={isActive('/settings') ? 'active' : ''}>
          <Link to="/settings">⚙️ Settings</Link>
        </li>

        {onCreateClick && (
          <li className="create">
            <button onClick={onCreateClick}>
              만들기 (피드작성)
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
