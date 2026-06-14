import { Request, Response, NextFunction } from "express";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    // TS에서는 return res.status(...) 처럼 한 줄로 쓰면
    // 반환 타입이 Response 객체로 잡혀서 에러가 날 수 있으므로 분리하는 것을 권장합니다.
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // 앞서 전역으로 설정한 user?: UserType 덕분에 에러가 나지 않고 자동완성됩니다!
  res.status(200).json(req.user);
}
