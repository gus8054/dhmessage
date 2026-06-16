// date는 문자열(ISO 날짜), 숫자(타임스탬프), 혹은 Date 객체 자체일 수 있으므로 모두 허용합니다.
export function formatMessageTime(date: string | number | Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
