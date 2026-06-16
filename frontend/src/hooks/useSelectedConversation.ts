import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils"; // 경로 확인 필요
import { useChatStore, type Message } from "../store/useChatStore";
import { useAuthStore, type User } from "../store/useAuthStore";

// 1. UI 컴포넌트들이 실제로 렌더링할 때 사용할 '예쁜 데이터'의 타입을 정의합니다.
export interface MappedMessage {
  id: string;
  role: "me" | "them";
  text: string;
  time: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface MappedPeer {
  name?: string;
  subtitle?: string;
  isOnline: boolean;
  avatarUrl?: string;
  initials: string;
}

export interface MappedConversation {
  id: string;
  peer: MappedPeer;
  messages: MappedMessage[];
}

// 어댑터 함수의 매개변수 타입을 정의합니다.
interface MapUserToConversationParams {
  user: User;
  messages: Message[];
  authUser: User | null;
  onlineUsers: string[];
}

// John Doe -> JD
// name이 undefined일 수 있으므로 기본값을 빈 문자열로 줍니다.
export function getInitials(name: string = ""): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((namePart) => namePart[0])
    .join("");
}

// mapUserToConversation is an adapter — it converts the raw backend shapes
// (a user document + an array of message documents) into the clean view-model
// that the chat UI components expect to render.
function mapUserToConversation({
  user,
  messages,
  authUser,
  onlineUsers,
}: MapUserToConversationParams): MappedConversation {
  const mappedMessages: MappedMessage[] = messages.map((message) => {
    return {
      id: message._id,
      role: String(message.senderId) === String(authUser?._id) ? "me" : "them",
      text: message.text || "",
      time: formatMessageTime(message.createdAt),
      imageUrl: message.image, // 백엔드 필드명(image 또는 media)에 맞게 매핑합니다.
      videoUrl: message.video,
    };
  });

  return {
    id: user._id,
    peer: {
      name: user.fullName,
      subtitle: user.email,
      isOnline: onlineUsers.includes(user._id),
      avatarUrl: user.profilePic,
      // fullName이 없을 경우를 대비해 안전하게 fallback 처리합니다.
      initials: getInitials(user.fullName || "Unknown User"),
    },
    messages: mappedMessages,
  };
}

export function useSelectedConversation() {
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const messages = useChatStore((state) => state.messages);

  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const selectedUser = activeConversationId
    ? users.find((user) => user._id === activeConversationId) ||
      conversations.find((user) => user._id === activeConversationId)
    : null;

  // 선택된 유저가 있다면 어댑터를 통과시켜 UI용 데이터로 변환합니다.
  const activeConversation: MappedConversation | null = selectedUser
    ? mapUserToConversation({
        user: selectedUser,
        messages,
        authUser,
        onlineUsers,
      })
    : null;

  return {
    activeConversation,
    activeConversationId,
    isLargeScreen,
  };
}
