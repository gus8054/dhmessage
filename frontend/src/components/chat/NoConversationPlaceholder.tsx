import { MessageCircleIcon } from "lucide-react";

export function NoConversationPlaceholder() {
  return (
    <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:gap-5 sm:px-8 sm:py-16">
      <div
        className="flex size-22 items-center justify-center rounded-3xl bg-accent-soft"
        aria-hidden
      >
        <MessageCircleIcon className="size-10 text-accent" strokeWidth={1.25} />
      </div>
      <div className="max-w-76 space-y-2">
        <h2 className="text-[16px] font-semibold tracking-tight sm:text-[17px]">
          채팅을 선택하세요
        </h2>
        <p className="text-[13px] leading-relaxed text-muted">
          메시지를 읽고 보내려면 좌측의 사용자 및 채팅을 클릭하세요.
        </p>
      </div>
    </div>
  );
}
