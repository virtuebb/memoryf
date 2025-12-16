import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants/navigation';

function Sidebar({ onCreateClick }) {
  return (
    <div className="left-section sidebar-wrap">
      <div className="section-content">
        <nav className="sidebar">
          {NAVIGATION_ITEMS.map((item) => {
            // "만들기" 버튼은 모달 열기
            if (item.path === '/feeds/new' && onCreateClick) {
              return (
                <button
                  key={item.path}
                  onClick={onCreateClick}
                  className="sidebar-link sidebar-button"
                >
                  {item.label}
                </button>
              );
            }
            // 나머지는 Link
            return (
              <Link key={item.path} to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
