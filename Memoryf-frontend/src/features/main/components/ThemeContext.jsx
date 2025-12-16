import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const themes = [
  {
    name: "Rose",
    desc: "Soft & romantic",
    color: "#F5D2D2",
  },
  {
    name: "Cream",
    desc: "Warm & cozy",
    color: "#F8F7BA",
  },
  {
    name: "Warm",
    desc: "Golden & bright",
    color: "#BDE3C3",
  },
  {
    name: "Peach",
    desc: "Peachy & sweet",
    color: "#A3CCDA",
  },
];

export function ThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(0);

  const value = {
    theme: themes[themeIndex],
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
