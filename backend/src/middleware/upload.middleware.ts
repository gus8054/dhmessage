import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25mb

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      // 에러가 발생했을 때는 에러 객체를 넘겨줍니다.
      cb(new Error("Only image and video uploads are allowed"));
      return;
    }

    // 에러가 없고(null), 파일 업로드를 허용(true)합니다.
    cb(null, true);
  },
});
