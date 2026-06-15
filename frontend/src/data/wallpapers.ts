import { type CSSProperties } from "react";

// 1. 카테고리와 배경화면 객체의 타입을 각각 정의합니다.
export interface WallpaperSection {
  id: string;
  title: string;
}

export interface Wallpaper {
  id: string;
  category: string;
  label: string;
  url: string;
}

// 2. 배열에 정의한 타입을 지정해 줍니다.
export const WALLPAPER_SECTIONS: WallpaperSection[] = [
  { id: "desktop", title: "Desktop" },
  { id: "abstract", title: "Abstract" },
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "sonoma-horizon",
    category: "desktop",
    label: "Sonoma Horizon",
    url: "/wallpapers/sonoma-horizon.jpg",
  },
  {
    id: "redwoods",
    category: "desktop",
    label: "Redwoods",
    url: "/wallpapers/redwoods.jpg",
  },
  {
    id: "utah-evening",
    category: "desktop",
    label: "Utah Evening",
    url: "/wallpapers/utah-evening.jpg",
  },
  {
    id: "san-francisco-bay",
    category: "desktop",
    label: "San Francisco Bay",
    url: "/wallpapers/san-francisco-bay.jpg",
  },
  {
    id: "iceland-coast",
    category: "desktop",
    label: "Iceland Coast",
    url: "/wallpapers/iceland-coast.jpg",
  },
  {
    id: "new-york-midtown",
    category: "desktop",
    label: "New York Midtown",
    url: "/wallpapers/new-york-midtown.jpg",
  },
  {
    id: "macos-graphic",
    category: "abstract",
    label: "macOS Graphic",
    url: "/wallpapers/macos-graphic.jpg",
  },
  {
    id: "radial-yellow",
    category: "abstract",
    label: "Radial Yellow",
    url: "/wallpapers/radial-yellow.jpg",
  },
  {
    id: "radial-purple",
    category: "abstract",
    label: "Radial Purple",
    url: "/wallpapers/radial-purple.jpg",
  },
  {
    id: "radial-green",
    category: "abstract",
    label: "Radial Green",
    url: "/wallpapers/radial-green.jpg",
  },
  {
    id: "radial-blue",
    category: "abstract",
    label: "Radial Blue",
    url: "/wallpapers/radial-blue.jpg",
  },
  {
    id: "ventura-light",
    category: "abstract",
    label: "Ventura",
    url: "/wallpapers/ventura-light.jpg",
  },
  {
    id: "ventura-dark",
    category: "abstract",
    label: "Ventura Dark",
    url: "/wallpapers/ventura-dark.jpg",
  },
];

// 3. url 파라미터를 string으로 받고, 반환 타입을 React.CSSProperties로 지정합니다.
export function frameStyleFromUrl(url: string): CSSProperties {
  return {
    backgroundImage: `url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

// 4. id 파라미터를 string으로 받고, 반드시 Wallpaper 객체를 반환한다고 명시합니다.
export function getWallpaperById(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
}
