import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, { cors: { origin: [allowedOrigin] } });

// 1. 객체의 타입을 명확히 정의합니다. (키는 string, 값도 string)
const userSocketMap: Record<string, string> = {};

// 2. 매개변수와 반환 타입을 지정합니다.
function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

// 3. socket 객체의 타입을 Socket으로 명시합니다.
io.on("connection", (socket: Socket) => {
  // 4. query 매개변수는 배열일 수도 있으므로, string으로 명확히 단언해줍니다.
  const userId = socket.handshake.query.userId as string | undefined;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() sends event to everyone - broadcast
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on is used to listen for events
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      // 유저가 나갔을 때 갱신된 접속자 명단을 다시 뿌려줍니다.
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io, getReceiverSocketId };
