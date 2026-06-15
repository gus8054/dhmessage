// import { useEffect } from "react";
// import { useWallpaper } from "../context/WallpaperContext"; // 경로 및 파일명 확인 필요
// import { useChatStore } from "../store/useChatStore";
// import { useSelectedConversation } from "../hooks/useSelectedConversation";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import { ChatHeader } from "../components/chat/ChatHeader";
// import { MessageList } from "../components/chat/MessageList";
// import { ChatComposer } from "../components/chat/ChatComposer";

// // 반환 타입을 JSX.Element로 지정하여 React 컴포넌트임을 명시합니다.
// function ChatPage(): JSX.Element {
//   const { frameStyle } = useWallpaper();

//   const getConversations = useChatStore((state) => state.getConversations);
//   const getMessages = useChatStore((state) => state.getMessages);
//   const getUsers = useChatStore((state) => state.getUsers);
//   const subscribeToMessages = useChatStore(
//     (state) => state.subscribeToMessages,
//   );
//   const unsubscribeFromMessages = useChatStore(
//     (state) => state.unsubscribeFromMessages,
//   );

//   // 이 커스텀 훅(useSelectedConversation) 내부도 나중에 TS로 변환해주면 완벽합니다.
//   const { activeConversation, activeConversationId, isLargeScreen } =
//     useSelectedConversation();

//   useEffect(() => {
//     getUsers();
//     getConversations();
//   }, [getConversations, getUsers]);

//   useEffect(() => {
//     if (!activeConversationId) return;

//     getMessages(activeConversationId);
//     subscribeToMessages(activeConversationId);

//     // cleanup 함수: 채팅방을 나가거나 컴포넌트가 사라질 때 소켓 구독을 해제합니다.
//     return () => {
//       unsubscribeFromMessages();
//     };
//   }, [
//     getMessages,
//     activeConversationId,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   ]);

//   return (
//     <div
//       className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8"
//       style={frameStyle}
//     >
//       <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
//         {/* 왼쪽: 채팅방 목록 사이드바 */}
//         <ChatSidebar />

//         {/* 오른쪽: 채팅 내용 화면 (반응형 대응) */}
//         <div
//           className={`flex-1 flex-col overflow-hidden ${
//             !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
//           }`}
//         >
//           <ChatHeader />
//           <MessageList />

//           {/* 대화 상대가 선택되었을 때만 입력창을 보여줍니다 */}
//           {activeConversation ? <ChatComposer /> : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;
