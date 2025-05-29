// frontend/src/components/ThemeToggle/hook/index.ts

"use client";
import React from "react";
import { createTheme, ThemeOptions, Theme } from "@mui/material";

type ThemeMode = "light" | "dark";

interface CustomPalette {
  main: {
    bgColor: string;
    textColor: string;
    iconColor: string;
  };
  card: {
    bgColor: string;
    headTextColor: string;
    contentTextColor: string;
  };
  button: {
    bgColor: string;
    bgHoverColor: string;
    textColor: string;
  };
  slider: {
    textColor: string;
  };
  input: {
    bgColor: string;
    bgHoverColor: string;
    textColor: string;
  };
  icon: {
    selectedColor: string;
    hoverColor: string;
  };
}

declare module "@mui/material/styles" {
  // eslint-disable-next-line no-unused-vars
  interface Palette extends CustomPalette {}
}

interface AppThemeConfig extends ThemeOptions {
  palette: CustomPalette & { mode: "light" | "dark" };
}

interface UseAppThemeReturn {
  appTheme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "var(--font-walsheim-regular), var(--font-walsheim-bold)",
  },
};

const paletteConfig: Record<ThemeMode, AppThemeConfig["palette"]> = {
  dark: {
    mode: "dark",
    main: {
      bgColor: "#4a4a4a",
      textColor: "#f3f1ee",
      iconColor: "#f9f8f5",
    },
    card: {
      bgColor: "#221f1f",
      headTextColor: "#f1f1f1",
      contentTextColor: "#c5c5c5",
    },
    button: {
      bgColor: "#3395ab",
      bgHoverColor: "#98c1e1",
      textColor: "#e5f2f5",
    },
    slider: { textColor: "#3277ae" },
    input: {
      bgColor: "#3395ab",
      bgHoverColor: "#98c1e1",
      textColor: "#f1f1f1",
    },
    icon: {
      selectedColor: "#7a736e",
      hoverColor: "#9d9d9d",
    },
  },
  light: {
    mode: "light",
    main: {
      bgColor: "#f3f1ee",
      textColor: "#333333",
      iconColor: "#353c47",
    },
    card: {
      bgColor: "#ffffff",
      headTextColor: "#333333",
      contentTextColor: "#7a736e",
    },
    button: {
      bgColor: "#3277ae",
      bgHoverColor: "#44687d",
      textColor: "#ffffff",
    },
    slider: { textColor: "#3277ae" },
    input: {
      bgColor: "#ffffff",
      bgHoverColor: "#cce4ea",
      textColor: "#333333",
    },
    icon: {
      selectedColor: "#a6a6a6",
      hoverColor: "#f3f1ec",
    },
  },
};

const themeCache = new Map<ThemeMode, Theme>();

const getTheme = (mode: ThemeMode): Theme => {
  const cachedTheme = themeCache.get(mode);
  if (cachedTheme) return cachedTheme;

  const theme = createTheme({
    ...baseThemeOptions,
    palette: paletteConfig[mode],
  });

  themeCache.set(mode, theme);
  return theme;
};

const useAppTheme = (): UseAppThemeReturn => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return (document.documentElement.getAttribute("data-theme") as ThemeMode) || "dark";
  });

  const toggleTheme = React.useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
    setThemeMode(newMode);
  }, [themeMode]);

  return {
    appTheme: getTheme(themeMode),
    themeMode,
    toggleTheme,
  };
};

export default useAppTheme;
