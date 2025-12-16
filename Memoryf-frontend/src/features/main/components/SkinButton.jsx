import { useTheme, themes } from "../components/ThemeContext";
import "../css/SkinButton.css";

function SkinButton() {
  const { themeIndex, setThemeIndex } = useTheme();

  return (
    <div className="skin-card">
      <div className="skin-title">THEME</div>

      <div className="skin-grid">
        {themes.map((t, i) => (
          <button
            key={t.name}
            className={`skin-item ${themeIndex === i ? "active" : ""}`}
            onClick={() => setThemeIndex(i)}
          >
            <div className="skin-name">{t.name}</div>
            <div className="skin-desc">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SkinButton;
