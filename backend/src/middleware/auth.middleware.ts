import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import User, { UserType } from "../models/user.model.js";

export async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ message: "User profile is not synced yet" });
      return;
    }

    // 위에서 타입을 확장해 주었기 때문에 이제 에러가 나지 않습니다.
    req.user = user;

    next();
  } catch (error) {
    // 2. TypeScript에서 catch 블록의 error는 기본적으로 'unknown' 타입입니다.
    // 따라서 Error 객체로 취급하겠다고 명시해 주어야 .message를 쓸 수 있습니다.
    const err = error as Error;
    console.error("Error in protectRoute middleware:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
