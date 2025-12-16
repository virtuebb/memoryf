// shared css
import "../css/Header.css";

// assets
import logo from "../../assets/images/logo/Memorif-logo-main.png";


function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="MEMORYF" />
      </div>
    </header>
  );
}

export default Header;
