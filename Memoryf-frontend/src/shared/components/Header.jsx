// shared css
import "../css/Header.css";

// router
import { Link } from "react-router-dom";

// assets
import logo from "../../assets/images/logo/Memorif-logo-main.png";


function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/home" className="logo-link">
          <img src={logo} alt="MEMORYF" />
        </Link>
      </div>
    </header>
  );
}

export default Header;