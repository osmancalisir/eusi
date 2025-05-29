// frontend/src/components/ThemeToggle/index.tsx

"use client";

import React, { useContext, useState, useCallback, useEffect } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

interface ThemeToggleProps {
  theme?: Theme;
  color?: string;
  toggleTheme?: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, color, toggleTheme }) => {
  const context = useContext(ThemeContext);

  const activeTheme = theme ?? context.theme;
  const activeToggleTheme = toggleTheme ?? context.toggleTheme;

  return (
    <Tooltip title={`Switch to ${activeTheme === "light" ? "dark" : "light"} mode`}>
      <IconButton onClick={activeToggleTheme} color="inherit" aria-label="toggle theme" data-testid="theme-toggle">
        {activeTheme === "light" ? <DarkModeIcon sx={{ color }} /> : <LightModeIcon sx={{ color }} />}
      </IconButton>
    </Tooltip>
  );
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeMode") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      setTheme(mediaQuery.matches ? "light" : "dark");
      const handler = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "light" : "dark");
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newTheme);
      return newTheme;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeToggle;
