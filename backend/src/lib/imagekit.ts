import ImageKit, { toFile } from "@imagekit/nodejs";

// 1. TS에서는 환경 변수가 undefined일 수 있다고 경고하므로, as string으로 타입 단언을 해줍니다.
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
});

export function hasImageKitConfig(): boolean {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

// 2. 매개변수와 반환값의 타입을 명시합니다.
function createFileName(originalName: string = "upload"): string {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}

/**
 * Upload image or video to ImageKit
 * @see https://imagekit.io/docs/api-reference/upload-file/upload-file
 */
// 3. 파일 객체의 타입을 Express.Multer.File로 지정하고, 반환 타입을 Promise<string>으로 명시합니다.
export async function uploadChatMedia(
  file: Express.Multer.File,
): Promise<string> {
  const fileName = createFileName(file.originalname);

  const result = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName, { type: file.mimetype }),
    fileName,
    folder: "/chat",
  });

  // 💡 이 방어 코드를 추가
  if (!result.url) {
    throw new Error("ImageKit 업로드 결과에 URL이 존재하지 않습니다.");
  }

  return result.url;
}
