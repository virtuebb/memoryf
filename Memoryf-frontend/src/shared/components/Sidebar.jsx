// src/components/Sidebar.jsx

import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="sidebar">
      {/* 메뉴 목록: Home을 /로, Diary를 /diary로 연결 */}
      <Link to="/">Home</Link>
      <Link to="/diary">Diary</Link>
      <Link to="/feed">Feed</Link>
      {/* ... */}
    </nav>
  );
}
export default Sidebar;