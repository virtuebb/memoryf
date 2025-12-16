import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/**
 * 전역 테마 정의
 * - 여기서 정의한 CSS 변수들이 App 전체 색상을 결정합니다.
 * - 실제 반영은 ThemeProvider 안의 useEffect에서 documentElement style 로 세팅합니다.
 */
export const themes = [
  {
    name: "Rose",
    desc: "Soft & romantic",
    vars: {
      "--color-left-bg": "#fff6f4",
      "--color-main-bg": "#fff7f6",
      "--color-card-bg": "rgba(255, 255, 255, 0.96)",
      "--color-border-soft": "rgba(0,0,0,0.04)",
      "--color-border-card": "rgba(0,0,0,0.08)",
      "--color-label": "#b85a6b",
      "--color-sidebar-link": "#3a2a2a",
      "--color-sidebar-link-active-bg": "#ffe5de",
      "--color-sidebar-link-active-text": "#b85a6b",
      "--color-create-bg": "#ff8a65",
      "--color-create-text": "#ffffff",
    },
  },
  {
    name: "Cream",
    desc: "Warm & cozy",
    vars: {
      "--color-left-bg": "#fffaf0",
      "--color-main-bg": "#fff7e6",
      "--color-card-bg": "rgba(255, 255, 255, 0.98)",
      "--color-border-soft": "rgba(210, 180, 140, 0.25)",
      "--color-border-card": "rgba(210, 180, 140, 0.4)",
      "--color-label": "#c56b1f",
      "--color-sidebar-link": "#4a2f12",
      "--color-sidebar-link-active-bg": "#ffe0b3",
      "--color-sidebar-link-active-text": "#c56b1f",
      "--color-create-bg": "#ff9900",
      "--color-create-text": "#ffffff",
    },
  },
  {
    name: "Forest",
    desc: "Calm & fresh",
    vars: {
      "--color-left-bg": "#ecf8f3",
      "--color-main-bg": "#e4f3ec",
      "--color-card-bg": "rgba(255, 255, 255, 0.98)",
      "--color-border-soft": "rgba(15, 118, 110, 0.12)",
      "--color-border-card": "rgba(15, 118, 110, 0.28)",
      "--color-label": "#0f766e",
      "--color-sidebar-link": "#064e3b",
      "--color-sidebar-link-active-bg": "#ccfbf1",
      "--color-sidebar-link-active-text": "#0f766e",
      "--color-create-bg": "#059669",
      "--color-create-text": "#ffffff",
    },
  },
  {
    name: "Night",
    desc: "Dark & neon",
    vars: {
      "--color-left-bg": "#020617",
      "--color-main-bg": "#020617",
      "--color-card-bg": "rgba(15, 23, 42, 0.98)",
      "--color-border-soft": "rgba(148, 163, 184, 0.25)",
      "--color-border-card": "rgba(148, 163, 184, 0.45)",
      "--color-label": "#38bdf8",
      "--color-sidebar-link": "#e5e7eb",
      "--color-sidebar-link-active-bg": "rgba(56, 189, 248, 0.12)",
      "--color-sidebar-link-active-text": "#38bdf8",
      "--color-create-bg": "#38bdf8",
      "--color-create-text": "#020617",
    },
  },
];

export function ThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = themes[themeIndex];

  // 현재 선택된 테마를 CSS 변수에 반영
  useEffect(() => {
    if (!theme?.vars) return;

    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  const value = {
    theme,
    themeIndex,
    setThemeIndex,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within a ThemeProvider"
    );
  }

  return context;
}
