// shared css
import "../css/Header.css";

// assets
import logo from "../../assets/images/logo/Memorif-logo-main.png";


function Header() {
  return (
    <header className="header sidebar-section card">
      {/* 로고 */}
      <div className="logo-section">
        <img src={logo} alt="MEMORYF" />
      </div>

    </header>
  );
}

export default Header;
