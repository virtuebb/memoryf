import "./Menu.css";

function Menu() {
  return (
    <nav className="menu">
      <ul>
        <li className="active">
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </li>

        <li>
          <span className="icon">📔</span>
          <span className="label">Diary</span>
        </li>

        <li>
          <span className="icon">📰</span>
          <span className="label">Feed</span>
        </li>

        <li>
          <span className="icon">💬</span>
          <span className="label">DM</span>
        </li>

        <li>
          <span className="icon">🖼</span>
          <span className="label">Album</span>
        </li>

        <li>
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
