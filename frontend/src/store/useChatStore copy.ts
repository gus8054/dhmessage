// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import toast from "react-hot-toast";
// import { AxiosError } from "axios";

// import { axiosInstance } from "../lib/axios";
// import { useAuthStore, type User } from "./useAuthStore";

// // 1. 메시지 데이터에 대한 타입을 정의합니다.
// export interface Message {
//   _id: string;
//   senderId: string;
//   receiverId: string;
//   text?: string;
//   media?: string;
//   createdAt: string;
// }

// // 2. ChatStore가 가질 모든 상태와 액션의 타입을 명시합니다.
// interface ChatStore {
//   users: User[];
//   conversations: User[];
//   messages: Message[];
//   selectedUser: User | null;
//   isConversationsLoading: boolean;
//   isUsersLoading: boolean;
//   isMessagesLoading: boolean;
//   activeConversationId: string | null;
//   searchQuery: string;
//   sidebarTab: "chats" | "contacts" | string; // 필요에 따라 탭 종류를 구체화할 수 있습니다.
//   composerText: string;
//   isSoundEnabled: boolean;
//   isSendingMedia: boolean;

//   getUsers: () => Promise<void>;
//   getConversations: () => Promise<void>;
//   getMessages: (userId: string) => Promise<void>;
//   // messageData는 일반 객체({ text: string })일 수도 있고 FormData일 수도 있습니다.
//   sendMessage: (messageData: { text?: string } | FormData) => Promise<boolean>;
//   subscribeToMessages: (userId: string) => void;
//   unsubscribeFromMessages: () => void;
//   setSelectedUser: (selectedUser: User | null) => void;
//   setActiveConversationId: (activeConversationId: string | null) => void;
//   setSearchQuery: (searchQuery: string) => void;
//   setSidebarTab: (sidebarTab: string) => void;
//   setComposerText: (composerText: string) => void;
//   setSoundEnabled: (isSoundEnabled: boolean) => void;
//   sendTextMessage: (conversationId: string) => Promise<boolean>;
//   sendMediaMessage: (params: {
//     conversationId: string;
//     file: File;
//   }) => Promise<boolean>;
// }

// // 에러 응답의 기본 형태를 정의해 줍니다.
// interface ErrorResponse {
//   message: string;
// }

// // 3. create 함수 뒤에 <ChatStore>() 를 붙여 제네릭을 설정합니다. (괄호 두 개 주의!)
// export const useChatStore = create<ChatStore>()(
//   persist(
//     (set, get) => ({
//       users: [],
//       conversations: [],
//       messages: [],
//       selectedUser: null,
//       isConversationsLoading: false,
//       isUsersLoading: false,
//       isMessagesLoading: false,
//       activeConversationId: null,
//       searchQuery: "",
//       sidebarTab: "chats",
//       composerText: "",
//       isSoundEnabled: true,
//       isSendingMedia: false,

//       getUsers: async () => {
//         // 1. 유저 목록을 불러오기 시작하므로, 로딩 스피너를 띄우기 위해 상태를 true로 만듭니다.
//         set({ isUsersLoading: true });
//         try {
//           // 2. 백엔드(/messages/users)에 GET 요청을 보내 유저 목록을 가져옵니다.
//           // <User[]>를 통해 "이 응답 데이터는 User 객체들의 배열이야!"라고 타입스크립트에게 알려줍니다.
//           const res = await axiosInstance.get<User[]>("/messages/users");
//           // 3. 데이터를 성공적으로 받아왔으니 스토어의 상태를 업데이트(set) 합니다.
//           // 이전 상태값(state)을 활용하기 위해 화살표 함수 형태로 작성했습니다.
//           set((state) => ({
//             // 4. 새롭게 받아온 유저 배열(res.data)을 users 상태에 덮어씌웁니다.
//             users: res.data,
//             // 5. 현재 선택된 유저(selectedUser) 상태를 어떻게 할지 결정하는 삼항 연산자 시작점입니다.
//             // 6. [조건] 기존에 선택된 유저가 있고(state.selectedUser),
//             // 동시에 새롭게 받아온 유저 목록(res.data) 안에 그 선택된 유저의 아이디(_id)가 아직 존재한다면?
//             // 7. [참일 때] 그 선택된 유저를 그대로 유지합니다.
//             // 8. [거짓일 때] 새로고침 했더니 그 유저가 탈퇴했거나 목록에서 사라졌다면, 선택을 해제(null) 합니다.
//             selectedUser:
//               state.selectedUser &&
//               res.data.some(
//                 (user: User) => user._id === state.selectedUser?._id,
//               )
//                 ? state.selectedUser
//                 : null,
//           }));
//         } catch (error) {
//           // 9. 요청 중 에러가 발생했다면, 이 에러를 Axios 전용 에러 타입으로 단언(as)하여
//           // 자동 완성과 타입 안정성을 확보합니다.
//           const err = error as AxiosError<ErrorResponse>;
//           // 10. 콘솔에 에러 메시지를 출력합니다.
//           console.log("Error in get Users", err.message);
//         } finally {
//           // 11. 통신이 성공하든 실패하든 상관없이, 작업이 끝났으므로 로딩 상태를 false로 되돌립니다.
//           set({ isUsersLoading: false });
//         }
//       },

//       getConversations: async () => {
//         set({ isConversationsLoading: true });
//         try {
//           const res = await axiosInstance.get<User[]>(
//             "/messages/conversations",
//           );
//           set({ conversations: res.data });
//         } catch (error) {
//           const err = error as AxiosError<ErrorResponse>;
//           console.log("Error in getConversations", err.message);
//         } finally {
//           set({ isConversationsLoading: false });
//         }
//       },

//       getMessages: async (userId) => {
//         if (!userId) return;
//         set({ isMessagesLoading: true });
//         try {
//           const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
//           set({ messages: res.data });
//         } catch (error) {
//           const err = error as AxiosError<ErrorResponse>;
//           toast.error(err.response?.data?.message || "Failed to load messages");
//         } finally {
//           set({ isMessagesLoading: false });
//         }
//       },
//       // 1. 메시지 데이터를 인자로 받아 비동기(async)로 처리하는 함수를 선언합니다.
//       // (messageData는 일반 텍스트 객체일 수도 있고, 이미지 파일이 담긴 FormData일 수도 있습니다)
//       sendMessage: async (messageData) => {
//         // 2. get()을 사용해 현재 스토어에 저장되어 있는 '현재 대화 중인 상대방(selectedUser)'과 '지금까지의 메시지 내역(messages)'을 가져옵니다.
//         const { selectedUser, messages } = get();
//         // 3. [방어 로직] 만약 선택된 유저가 없다면? (채팅방이 안 열려있다면)
//         // 메시지를 보낼 대상이 없으므로 아무 작업도 하지 않고 false를 반환하며 함수를 끝냅니다.
//         if (!selectedUser) return false;

//         try {
//           // 4. [API 통신] 백엔드에 메시지 전송(POST) 요청을 보냅니다.
//           // 주소 끝에 받을 사람의 아이디(selectedUser._id)를 붙이고, 내가 보낼 데이터(messageData)를 함께 보냅니다.
//           // <Message>를 통해 서버에서 돌려주는 응답(res.data)이 완벽한 메시지 객체 형태임을 타입스크립트에게 알려줍니다.
//           const res = await axiosInstance.post<Message>(
//             `/messages/send/${selectedUser._id}`,
//             messageData,
//           );
//           // 5. [상태 업데이트 1] 통신이 성공하면 화면을 즉각 업데이트합니다.
//           // 기존 메시지들(...messages) 뒤에 방금 서버가 확정 지어준 새 메시지(res.data)를 덧붙입니다.
//           // 동시에 'composerText'를 ""(빈 문자열)로 만들어, 유저의 채팅 입력창을 깨끗하게 비워줍니다!
//           set({ messages: [...messages, res.data], composerText: "" });
//           // 6. [상태 업데이트 2] 내가 방금 메시지를 보냈으니, 왼쪽 사이드바의 '채팅방 목록'에 뜨는
//           // [마지막으로 보낸 메시지]와 [시간] 등도 최신화하기 위해 대화 목록을 다시 불러옵니다.
//           get().getConversations();
//           // 7. 성공적으로 전송을 마쳤다는 의미로 true를 반환합니다.
//           return true;
//         } catch (error) {
//           const err = error as AxiosError<ErrorResponse>;
//           toast.error(err.response?.data?.message || "Failed to send message");
//           return false;
//         }
//       },
//       // 1. 특정 유저(상대방)의 아이디를 인자로 받아, 그 사람과 주고받는 실시간 메시지를 구독(Subscribe)하는 함수입니다.
//       // 이 함수는 주로 채팅방 페이지(ChatPage.tsx)가 켜질 때 실행됩니다.
//       subscribeToMessages: (userId) => {
//         // 2. [방어 로직] 만약 상대방 아이디가 넘어오지 않았다면 (채팅방이 제대로 안 열렸다면) 구독할 필요가 없으니 그냥 함수를 종료합니다.
//         if (!userId) return;
//         // 3. 앞서 만들었던 전역 상태 관리소(useAuthStore)에서 현재 연결된 '웹소켓 객체(socket)'를 몰래(getState) 빼옵니다.
//         // get() 대신 getState()를 쓰는 이유는, 다른 스토어의 상태를 가져올 때 쓰는 Zustand의 특별한 문법이기 때문입니다.
//         const socket = useAuthStore.getState().socket;
//         // 4. [방어 로직] 만약 웹소켓 연결이 아직 안 되어있다면(서버가 꺼졌거나 로그인 중이 아니라면)
//         // 메시지를 받을 수 없으니 함수를 종료합니다.
//         if (!socket) return;
//         // 5. [핵심 1: 리스너 초기화] 소켓에 귀를 기울이기 전에, 혹시나 예전에 등록된 똑같은 이름의 리스너가 있다면 먼저 지워버립니다.
//         // 이렇게 안 하면, 채팅방을 여러 번 왔다 갔다 할 때마다 리스너가 중복으로 등록되어 메시지가 두세 번씩 찍히는(메모리 누수) 끔찍한 버그가 생깁니다.
//         socket.off("newMessage");
//         // 6. [핵심 2: 리스너 등록] 이제 백엔드에서 'newMessage'라는 이름표를 달고 날아오는 데이터를 기다립니다.
//         // 데이터가 날아오면 그 안의 내용(newMessage)을 가져와 콜백 함수를 실행합니다.
//         socket.on("newMessage", (newMessage: Message) => {
//           // if im not the receiver don't do anything just return
//           // 7. [필터링 방어막] 매우 중요한 코드입니다!
//           // 백엔드는 누군가 메시지를 보내면, 나(로그인한 사람)에게 무조건 이벤트를 쏴줍니다.
//           // 하지만 만약 내가 지금 '철수'랑 채팅방을 열어놓고(userId = 철수) 있는데, '영희'가 나에게 메시지를 보냈다면?
//           // 그 영희의 메시지가 철수와의 채팅방 화면에 그려지면 안 되겠죠!
//           // 그래서 "방금 날아온 메시지의 보낸 사람(senderId)이, 지금 내가 화면에 띄워둔 상대방(userId)과 다르면 무시하고 버려라!" 라고 필터링하는 것입니다.
//           if (String(newMessage.senderId) !== String(userId)) return;
//           // 8. [상태 업데이트 1] 필터링을 통과했다면(즉, 지금 대화 중인 상대방이 보낸 게 맞다면)
//           // 내 화면의 현재 메시지 목록(...get().messages) 끝에 방금 받은 새 메시지를 쏙 추가합니다.
//           // 이 순간 React가 변경을 감지하고 화면에 메시지를 그려줍니다!
//           set({ messages: [...get().messages, newMessage] });
//           // 9. [상태 업데이트 2] 상대방이 보낸 최신 메시지를 받았으니,
//           // 왼쪽 사이드바의 채팅방 목록에 있는 '마지막 메시지' 내용도 최신화하기 위해 대화 목록 전체를 다시 불러옵니다.
//           get().getConversations();
//         });
//       },

//       unsubscribeFromMessages: () => {
//         const socket = useAuthStore.getState().socket;
//         socket?.off("newMessage");
//       },

//       setSelectedUser: (selectedUser) => set({ selectedUser }),
//       // 1. 유저가 클릭한 채팅방(또는 친구)의 아이디를 인자로 받습니다.
//       setActiveConversationId: (activeConversationId) => {
//         // 2. 스토어의 상태를 업데이트합니다.
//         set((state) => ({
//           // 3. 현재 활성화된 채팅방 아이디를 클릭한 아이디로 바꿉니다.
//           activeConversationId,
//           // 4. 아이디만으로는 화면에 상대방의 이름이나 프사를 띄울 수 없으므로,
//           // 전체 유저 목록(users)이나 대화 목록(conversations)에서 이 아이디를 가진 '유저 객체'를 찾아냅니다.
//           // 먼저 전체 연락처(users)에서 찾아보고, 없으면 최근 대화 목록(conversations)에서 찾습니다.
//           // 둘 다 못 찾으면(아이디가 null로 들어왔거나 탈퇴한 유저라면) null을 넣습니다.
//           selectedUser:
//             state.users.find((user) => user._id === activeConversationId) ||
//             state.conversations.find(
//               (user) => user._id === activeConversationId,
//             ) ||
//             null,
//           // 5. 만약 채팅방을 클릭했다면(activeConversationId가 존재하면) 기존 메시지 상태를 일단 유지하고,
//           // (보통 이 직후에 getMessages()를 호출해 새 메시지로 덮어씌웁니다)
//           // 채팅방을 닫았다면(null) 화면에 보일 메시지도 빈 배열([])로 초기화해 줍니다.
//           messages: activeConversationId ? state.messages : [],
//         }));
//       },
//       // 검색창에 글자를 칠 때마다 실행되어, 사이드바의 친구 목록을 필터링할 때 쓸 검색어를 저장합니다.
//       setSearchQuery: (searchQuery) => set({ searchQuery }),
//       // 사이드바에서 [최근 대화(chats)] 탭과 [전체 연락처(contacts)] 탭을 왔다 갔다 클릭할 때 쓰입니다.
//       setSidebarTab: (sidebarTab) => set({ sidebarTab }),
//       // 채팅 입력창에 키보드로 글자를 칠 때마다 한 글자씩 상태에 저장합니다. (나중에 전송할 때 꺼내 씁니다)
//       setComposerText: (composerText) => set({ composerText }),
//       // 환경 설정에서 "알림음 끄기/켜기" 스위치를 눌렀을 때 쓰입니다. (persist 덕분에 로컬 스토리지에 자동 저장됨)
//       setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),

//       // 1. 메시지를 보낼 채팅방의 아이디를 인자로 받습니다.
//       sendTextMessage: async (conversationId) => {
//         // 2. 아까 setComposerText로 열심히 저장해 둔 유저의 입력값을 꺼내오고,
//         // trim()을 써서 앞뒤에 실수로 들어간 무의미한 띄어쓰기나 줄바꿈을 싹 지워줍니다.
//         const messageText = get().composerText.trim();
//         // 3. [방어 로직] 방 아이디가 없거나, 스페이스바만 눌러서 메시지가 텅 비었다면?
//         // 헛된 API 요청을 막기 위해 false를 반환하고 끝냅니다.
//         if (!conversationId || !messageText) return false;
//         // 4. 우리가 이전에 만들어둔 만능 전송 함수인 sendMessage에
//         // 순수 텍스트 객체({ text: "안녕" })를 포장해서 넘겨주고, 그 결과를 반환합니다.
//         return get().sendMessage({ text: messageText });
//       },

//       // 1. 방 아이디와 유저가 선택한 파일(File 객체)을 통째로 받습니다.
//       sendMediaMessage: async ({ conversationId, file }) => {
//         // 2. [방어 로직] 방 아이디나 파일이 없으면 취소합니다.
//         if (!conversationId || !file) return false;
//         // 3. 파일은 일반 JSON 텍스트({ text: "..." }) 형태로 보낼 수 없습니다.
//         // 그래서 브라우저 내장 객체인 FormData를 만들어 그 안에 'media'라는 이름으로 파일을 쏙 집어넣습니다.
//         const formData = new FormData();
//         formData.append("media", file);
//         // 4. 사진 전송은 시간이 걸리므로, 화면에 빙글빙글 도는 로딩 애니메이션을 띄우기 위해 상태를 true로 만듭니다.
//         set({ isSendingMedia: true });
//         try {
//           // 5. 이번에는 텍스트가 아닌 FormData를 만능 전송 함수(sendMessage)에 통째로 던져줍니다.
//           return await get().sendMessage(formData);
//         } finally {
//           // 6. 전송이 성공하든 실패하든, 작업이 끝났으니 로딩 애니메이션을 끕니다(false).
//           set({ isSendingMedia: false });
//         }
//       },
//     }),
//     {
//       name: "imessage-storage",
//       // partialize는 저장할 상태만 쏙 골라내는 역할을 합니다.
//       partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
//     },
//   ),
// );
