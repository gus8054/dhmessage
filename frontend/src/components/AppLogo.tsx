export const APP_NAME = "iMessage";

// 1. AppLogo 컴포넌트가 받을 props의 타입을 정의합니다.
// 모두 기본값이 설정되어 있으므로 선택적 프로퍼티(?)로 지정합니다.
interface AppLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

// 2. 컴포넌트 파라미터에 AppLogoProps 타입을 적용하고 반환 타입을 명시합니다.
export function AppLogo({
  className = "",
  size = 32,
  alt = APP_NAME,
}: AppLogoProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 object-contain select-none ${className}`}
      draggable={false}
    />
  );
}
