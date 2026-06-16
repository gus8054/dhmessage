import { useEffect, useRef, type RefObject } from "react";

/**
 * Scrolls a container to the bottom when `threadKey` or `lastItemId` changes
 * (e.g. new message or switched conversation). Returns a ref for the scrollable element.
 */
// 1. 어떤 HTML 태그에든 붙일 수 있도록 제네릭(T)을 사용하고, 기본값으로 HTMLDivElement를 줍니다.
function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(
  threadKey?: string | null,
  lastItemId?: string | number | null, // ID는 문자열일 수도, 숫자일 수도 있으므로 유연하게 둡니다.
): RefObject<T | null> {
  // 2. useRef에 우리가 지정한 HTML 요소의 타입을 넣어줍니다.
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    if (threadKey == null || threadKey === "") return;

    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottom = () => {
      // 3. 타입스크립트는 이제 el이 HTMLElement라는 것을 알기 때문에
      // scrollTop, scrollHeight 속성에 접근할 때 자동 완성을 지원하고 에러를 내지 않습니다.
      el.scrollTop = el.scrollHeight;
    };

    scrollToBottom();
    requestAnimationFrame(scrollToBottom);
  }, [threadKey, lastItemId]);

  return scrollRef;
}

export default useScrollToBottom;
