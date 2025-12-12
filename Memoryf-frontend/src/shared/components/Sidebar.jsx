import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants/navigation';

function Sidebar() {
  return (
    <div className="left-section sidebar-wrap">
      <div className="section-content">
        <nav className="sidebar">
          {NAVIGATION_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} className="sidebar-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;