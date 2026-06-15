import { useEffect, useState, type JSX, type ReactNode } from "react";
import { frameStyleFromUrl, getWallpaperById } from "../data/wallpapers";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "chat-wallpaper-id";

// 로컬 스토리지에서 읽어오는 함수가 반드시 문자열(string)을 반환하도록 명시합니다.
function readStoredWallpaperId(): string {
  const wallpaperId = localStorage.getItem(STORAGE_KEY);
  if (wallpaperId) return wallpaperId;

  return "sonoma-horizon"; // 기본값
}

// children 프로퍼티의 타입을 ReactNode로 지정합니다.
interface WallpaperProviderProps {
  children: ReactNode;
}

export function WallpaperProvider({
  children,
}: WallpaperProviderProps): JSX.Element {
  // useState에 제네릭<string>을 사용하여 상태 타입을 명시합니다.
  const [wallpaperId, setWallpaperIdState] = useState<string>(
    readStoredWallpaperId,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, wallpaperId);
  }, [wallpaperId]);

  const wallpaper = getWallpaperById(wallpaperId);

  // id 파라미터를 문자열로 받도록 지정합니다.
  const setWallpaperId = (id: string): void => {
    setWallpaperIdState(id);
  };

  const frameStyle = frameStyleFromUrl(wallpaper.url);

  return (
    <WallpaperContext.Provider
      value={{ wallpaperId, setWallpaperId, wallpaper, frameStyle }}
    >
      {children}
    </WallpaperContext.Provider>
  );
}
