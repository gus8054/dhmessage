import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble, type MessageData } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

// Conversation 데이터의 구조를 정의합니다.
// (실제 데이터 구조에 맞춰 추가적인 속성이 있다면 수정해 주세요)
interface Message extends MessageData {
  id: string;
}

export function MessageList() {
  const { activeConversation, activeConversationId } =
    useSelectedConversation();

  const lastMessageId = activeConversation?.messages.at(-1)?.id;

  // 타입스크립트는 ref의 대상이 HTMLDivElement임을 자동으로 추론합니다.
  const messagesScrollRef = useScrollToBottom(
    activeConversationId,
    lastMessageId,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {activeConversation ? (
        <div
          ref={messagesScrollRef as React.RefObject<HTMLDivElement>}
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3 sm:py-4"
        >
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
            Today
          </p>
          {activeConversation.messages.map((message: Message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <NoConversationPlaceholder />
      )}
    </div>
  );
}
