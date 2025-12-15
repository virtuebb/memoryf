import "./Header.css";
import BgmPlayer from "./BgmPlayer";
import Menu from "./Menu";
import Visitors from "./Visitors";
import SkinButton from "./SkinButton";

function Header() {
  return (
    <aside className="sidebar">

      {/* 🔥 로고 (카드 아님) */}
      <div className="logo-section">
        <img src="/Memorif-logo-main.png" alt="MEMORYF" />
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
