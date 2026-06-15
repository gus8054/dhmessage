import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME_PRESET_ID } from "../data/herouiThemePresets";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
  type Theme,
} from "./theme"; // 파일명/경로 확인 필요

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): Theme | null {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme as Theme;

  return null;
}

// 2. 파라미터가 무조건 "light" 또는 "dark"만 들어오도록 강제합니다.
function applyDomTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

function readStoredThemePreset(): string {
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;

  return DEFAULT_THEME_PRESET_ID;
}

// 3. children 프로퍼티의 타입을 ReactNode로 지정합니다.
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // 4. 제네릭을 사용해 state의 타입을 확실하게 지정합니다.
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? getSystemTheme(),
  );
  const [themePreset, setThemePresetState] = useState<string>(
    readStoredThemePreset,
  );

  // this applies light/dark mode
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // this applies the theme preset, like sky, spotify, etc.
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // this stores the theme and theme preset in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  const setTheme = (next: Theme) => setThemeState(next);

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  // 5. next는 단순 문자열일 수도 있고, 이전 상태를 받아 새 상태를 반환하는 콜백 함수일 수도 있습니다.
  const setThemePreset = (next: string | ((prev: string) => string)) => {
    setThemePresetState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value = { theme, setTheme, toggleTheme, themePreset, setThemePreset };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
