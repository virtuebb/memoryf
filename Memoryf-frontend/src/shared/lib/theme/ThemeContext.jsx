import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/**
 * 전역 테마 정의
 * - vars: 컴포넌트 색상용 CSS 변수
 * - color: 테마 대표 색 (UI 포인트 / 미리보기)
 * - bg: 앱 전체 배경용 그라데이션
 */
export const themes = [
  {
    name: "Rose",
    desc: "Soft & romantic",
    color: "#F5D2D2",
    bg: "linear-gradient(180deg, #fff7f6 0%, #fdecec 100%)",
    vars: {
      "--color-pulse": "#f798b7",
      "--color-left-bg": "#fff6f4",
      "--color-main-bg": "#F5D2D2",
      "--color-card-bg": "rgba(255, 255, 255, 0.96)",

      "--color-accent": "#f798b7ff",
      "--color-accent-strong": "#e89aa6",

      /* ✅ action 의미 분리 */
      "--color-action-primary": "#e89aa6", // 팔로우 / 메인 버튼
      "--color-action-secondary": "#f798b7ff", // 검색 / 서브 버튼
      "--color-action-text": "#ffffff",

      "--color-border-soft": "rgba(0,0,0,0.04)",
      "--color-border-card": "rgba(0,0,0,0.08)",

      "--color-label": "#f798b7ff",
      "--color-sidebar-link": "#3a2a2aff",
      "--color-sidebar-link-active-bg": "#f798b7ff",
      "--color-sidebar-link-active-text": "#4c4b4bff",

      "--color-create-bg": "#e89aa6",
      "--color-create-text": "#4c4b4bff",
    },
  },

  {
    name: "Cream",
    desc: "Warm & cozy",
    color: "#f3dfb9ff",
    bg: "linear-gradient(180deg, #fffaf0 0%, #fff2d8 100%)",
    vars: {
      "--color-pulse": "#c56b1f",
      "--color-left-bg": "#fffaf0",
      "--color-main-bg": "#f3dfb9ff",
      "--color-card-bg": "rgba(255, 255, 255, 0.98)",

      "--color-accent": "#F8F7BA",
      "--color-accent-strong": "#e2d66b",

      /* ✅ action 의미 분리 */
      "--color-action-primary": "#e2d66b", // 팔로우
      "--color-action-secondary": "#c56b1f", // 검색
      "--color-action-text": "#ffffff",

      "--color-border-soft": "rgba(210, 180, 140, 0.25)",
      "--color-border-card": "rgba(210, 180, 140, 0.4)",

      "--color-label": "#c56b1f",
      "--color-sidebar-link": "#4a2f12",
      "--color-sidebar-link-active-bg": "#e6d36aff",
      "--color-sidebar-link-active-text": "#4c4b4bff",

      "--color-create-bg": "#f0cc6cff",
      "--color-create-text": "#4c4b4bff",
    },
  },

  {
    name: "Forest",
    desc: "Calm & fresh",
    color: "#BDE3C3",
    bg: "linear-gradient(180deg, #eef7f2 0%, #e4f3ec 100%)",
    vars: {
      "--color-pulse": "#0f766e",
      "--color-left-bg": "#ecf8f3",
      "--color-main-bg": "#BDE3C3",
      "--color-card-bg": "rgba(255, 255, 255, 0.98)",

      "--color-accent": "#BDE3C3",
      "--color-accent-strong": "#6fbf9c",

      /* ✅ action 의미 분리 */
      "--color-action-primary": "#6fbf9c",
      "--color-action-secondary": "#0f766e",
      "--color-action-text": "#ffffff",

      "--color-border-soft": "rgba(15, 118, 110, 0.12)",
      "--color-border-card": "rgba(15, 118, 110, 0.28)",

      "--color-label": "#0f766e",
      "--color-sidebar-link": "#064e3b",
      "--color-sidebar-link-active-bg": "#53dbc0ff",
      "--color-sidebar-link-active-text": "#4c4b4bff",

      "--color-create-bg": "#8bdac1ff",
      "--color-create-text": "#4c4b4bff",
    },
  },

  {
    name: "Night",
    desc: "Dark & neon",
    color: "#A3CCDA",
    bg: "radial-gradient(1200px at 50% -20%, #0f172a 0%, #020617 65%)",
    vars: {
      "--color-pulse": "#020617",

      "--color-left-bg": "#020617",
      "--color-main-bg": "#A3CCDA",
      "--color-card-bg": "rgba(181, 207, 224, 0.63)",

      "--color-accent": "#38bdf8",
      "--color-accent-strong": "#0ea5e9",

      /* ✅ action 의미 분리 */
      "--color-action-primary": "#38bdf8",
      "--color-action-secondary": "#7dd3fc",

      "--color-border-soft": "rgba(148, 163, 184, 0.25)",
      "--color-border-card": "rgba(181, 207, 224, 0.63)",

      "--color-label": "#38bdf8",
      "--color-sidebar-link": "#020617", // 🔥 Night 대비 개선
      "--color-sidebar-link-active-bg": "rgba(145, 203, 228, 1)",
      "--color-sidebar-link-active-text": "#020617",

      "--color-create-bg": "#38bdf8",
      "--color-create-text": "#020617",
    },
  },
];

export function ThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(() => {
    const saved = localStorage.getItem("themeIndex");
    return saved !== null ? Number(saved) : 0;
  });

  const theme = themes[themeIndex];

  useEffect(() => {
    localStorage.setItem("themeIndex", themeIndex);
  }, [themeIndex]);

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty("--app-bg", theme.bg);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeIndex, setThemeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
