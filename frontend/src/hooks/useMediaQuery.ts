import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query
 */
// 1. query 매개변수는 "(max-width: 768px)" 같은 문자열이므로 string으로 지정합니다.
// 2. 이 훅의 최종 반환값은 화면이 해당 사이즈에 맞는지 여부이므로 boolean으로 지정합니다.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    // onChange는 useSyncExternalStore가 알아서 콜백 함수로 추론해주기 때문에 타입을 따로 적지 않아도 완벽합니다.
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false, // 서버 사이드 렌더링(SSR) 시 에러를 막기 위한 기본값
  );
}
