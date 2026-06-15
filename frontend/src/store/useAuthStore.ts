// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import { io, Socket } from "socket.io-client";

// // 1. 유저 정보에 대한 타입을 정의합니다.
// // (백엔드 모델에 맞춰 필요한 필드들을 더 추가하시면 됩니다)
// export interface User {
//   _id: string;
//   email?: string;
//   fullName?: string;
//   profilePic?: string;
//   clerkId?: string;
// }

// // 2. Store가 가질 모든 상태(변수)와 액션(함수)의 타입을 정의합니다.
// interface AuthStore {
//   authUser: User | null;
//   isCheckingAuth: boolean;
//   onlineUsers: string[];
//   socket: Socket | null; // socket.io-client에서 제공하는 Socket 타입 사용

//   checkAuth: () => Promise<void>;
//   clearAuth: () => void;
//   connectSocket: (user: User | null) => void;
//   disconnectSocket: () => void;
// }

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// // 3. create 함수에 제네릭(<AuthStore>)으로 우리가 만든 타입을 주입합니다.
// export const useAuthStore = create<AuthStore>((set, get) => ({
//   authUser: null,
//   isCheckingAuth: true,
//   onlineUsers: [],
//   socket: null,

//   checkAuth: async () => {
//     set({ isCheckingAuth: true });

//     try {
//       // axios 요청의 결과값 타입도 명시해 줍니다.
//       const res = await axiosInstance.get<User>("/auth/check");
//       set({ authUser: res.data });

//       get().connectSocket(res.data);
//     } catch (error) {
//       console.error("Error in checkAuth:", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   clearAuth: () => {
//     set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
//     get().disconnectSocket();
//   },

//   connectSocket: (user) => {
//     if (!user || get().socket?.connected) return;

//     const socket = io(BASE_URL, { query: { userId: user._id } });

//     set({ socket });

//     // 웹소켓 이벤트로 들어오는 데이터의 타입도 지정해 줍니다.
//     socket.on("getOnlineUsers", (userIds: string[]) => {
//       set({ onlineUsers: userIds });
//     });
//   },

//   disconnectSocket: () => {
//     const socket = get().socket;
//     if (socket?.connected) socket.disconnect();
//     set({ socket: null });
//   },
// }));
