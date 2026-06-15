import { createContext, useContext } from "react";
import {
  DEFAULT_THEME_PRESET_ID,
  HERO_UI_THEME_PRESETS,
} from "../data/herouiThemePresets";

// 1. ThemeContext가 하위 컴포넌트들에게 제공할 데이터의 타입을 정의합니다.
// (실제 ThemeProvider에서 내려주는 값에 맞춰 수정해서 사용하시면 됩니다.)
export type Theme = "light" | "dark";

export interface ThemeContextValue {
  // 1. 라이트/다크 모드 관련 상태 및 함수
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // 2. 테마 프리셋(강조 색상) 관련 상태 및 함수
  themePreset: string;
  // setThemePreset은 단순 문자열뿐만 아니라, 이전 상태를 활용하는 콜백 함수도 받을 수 있도록 유니온 타입으로 지정합니다.
  setThemePreset: (preset: string | ((prev: string) => string)) => void;
}
// 2. createContext에 제네릭으로 우리가 만든 타입을 쏙 넣어줍니다. 처음엔 빈 값이므로 null도 허용합니다.
export const ThemeContext = createContext<ThemeContextValue | null>(null);

const PRESET_IDS = new Set(HERO_UI_THEME_PRESETS.map((p) => p.id));

// 3. 파라미터 타입을 string으로 지정하고 반환 타입을 boolean으로 명시합니다.
export function isValidThemePreset(presetId: string): boolean {
  return PRESET_IDS.has(presetId);
}

/** apply preset to `<html>` immediately so `--accent` updates before paint. */
// 4. 파라미터 타입을 string으로 지정합니다.
export function applyThemePresetToDocument(presetId: string): void {
  const id = isValidThemePreset(presetId) ? presetId : DEFAULT_THEME_PRESET_ID;
  document.documentElement.setAttribute("data-theme-preset", id);
}

// 5. useTheme 훅이 무조건 ThemeContextValue를 반환한다고 명시합니다.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  // 6. null 체크 방어 로직 덕분에 컴포넌트에서 꺼내 쓸 때 타입이 null일까봐 걱정하지 않아도 됩니다.
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
