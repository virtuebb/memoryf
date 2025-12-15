// shared css
import "../css/Header.css";

// assets
import logo from "../../assets/images/logo/Memorif-logo-main.png";

// features/main/components
import BgmPlayer from "../../features/main/components/BgmPlayer";
import Menu from "../../features/main/components/Menu";
import Visitors from "../../features/main/components/Visitors";
import SkinButton from "../../features/main/components/SkinButton";


function Header() {
  return (
    <aside className="sidebar">
      {/* 로고 */}
      <div className="logo-section">
        <img src={logo} alt="MEMORYF" />
      </div>

      {/* BGM */}
      <div className="bgm-wrapper sidebar-section card">
        <BgmPlayer />
      </div>

      {/* 메뉴 */}
      <div className="menu-section sidebar-section card">
        <Menu />
      </div>

      {/* 하단 */}
      <div className="sidebar-bottom">
        <div className="sidebar-section card">
          <Visitors />
        </div>

        <div className="sidebar-section card">
          <SkinButton />
        </div>
      </div>
    </aside>
  );
}

export default Header;
