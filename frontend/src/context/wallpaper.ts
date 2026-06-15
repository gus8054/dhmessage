import { createContext, useContext, type CSSProperties } from "react";
import { type Wallpaper } from "../data/wallpapers"; // 이전에 만든 Wallpaper 인터페이스 경로

// Context가 하위 컴포넌트들에게 제공할 데이터의 타입을 정의합니다.
export interface WallpaperContextValue {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  wallpaper: Wallpaper;
  frameStyle: CSSProperties;
}

export const WallpaperContext = createContext<WallpaperContextValue | null>(
  null,
);

export function useWallpaper(): WallpaperContextValue {
  const ctx = useContext(WallpaperContext);

  if (!ctx) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }

  return ctx;
}
