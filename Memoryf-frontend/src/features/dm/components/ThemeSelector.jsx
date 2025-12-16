/**
 * 🎨 테마 선택기 컴포넌트
 * 
 * 전역 ThemeContext의 테마(Rose, Cream, Forest, Night)를 사용합니다.
 */
import { useTheme, themes } from '../../../shared/components/ThemeContext';
import '../css/ThemeSelector.css';

export default function ThemeSelector() {
  const { themeIndex, setThemeIndex, theme } = useTheme();
  
  // Night 테마인지 확인 (다크 모드)
  const isDark = theme?.name === 'Night';

  return (
    <div className={`theme-selector ${isDark ? 'dark' : 'light'}`}>
      <div className="theme-selector-buttons">
        {themes.map((t, index) => (
          <button
            key={t.name}
            onClick={() => setThemeIndex(index)}
            className={`theme-selector-btn theme-${t.name.toLowerCase()} ${themeIndex === index ? 'active' : ''}`}
            title={`${t.name} - ${t.desc}`}
          />
        ))}
      </div>
      <p className={`theme-selector-label ${isDark ? 'dark' : 'light'}`}>
        {theme?.name} 테마
      </p>
    </div>
  );
}
