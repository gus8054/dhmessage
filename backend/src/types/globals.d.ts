/// <reference types="@clerk/express/env" />

import { UserType } from "../models/user.model.ts";

// 1. Express 기본 Request 객체에 user 속성을 추가하도록 '타입 확장'을 해줍니다.
declare global {
  namespace Express {
    interface Request {
      user?: UserType; // 아까 만든 UserType 타입을 연결해줍니다!
    }
  }
}
