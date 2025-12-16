import '../css/ThemeSelector.css';

export default function ThemeSelector({ theme, onThemeChange }) {
  const themeClass = theme === 'dark' ? 'dark' : 'light';
  
  const themes = [
    { id: 'light', label: '라이트' },
    { id: 'dark', label: '다크' },
    { id: 'blue', label: '블루' },
    { id: 'green', label: '그린' }
  ];

  return (
    <div className={`theme-selector ${themeClass}`}>
      <div className="theme-selector-buttons">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={`theme-selector-btn theme-${t.id} ${theme === t.id ? 'active' : ''}`}
            title={t.label}
          />
        ))}
      </div>
      <p className={`theme-selector-label ${themeClass}`}>
        테마 변경
      </p>
    </div>
  );
}
