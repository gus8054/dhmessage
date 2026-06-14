import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import "dotenv/config";

import fs from "fs";
import path from "path";

import { clerkMiddleware } from "@clerk/express";

// 💡 주의: tsconfig.json에서 'NodeNext'를 사용 중이라면,
// 실제 파일이 .ts라도 import 시에는 반드시 .js 확장자를 유지해야 합니다!
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// 1. 환경 변수 타입 에러 방지 (undefined 방어)
// TS는 process.env 값이 없을 수도 있다고 판단하므로 기본값을 주거나 강제 지정해야 합니다.
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const publicDir = path.join(process.cwd(), "public");

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

// 2. Request, Response 타입 명시
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  // 3. NextFunction 및 Error 타입 명시
  app.get("/{*any}", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(publicDir, "index.html"), (err: Error | null) => {
      if (err) next(err);
    });
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);

  if (process.env.NODE_ENV === "production") job.start();
});
