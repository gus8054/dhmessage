import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI;

    // 기존에 작성하신 이 방어 로직 덕분에, TS가 mongoUri를 무조건 string으로 확신하게 됩니다!
    if (!mongoUri) {
      throw new Error("MONGO_URI is required");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    // catch 블록의 에러를 Error 객체로 단언해 줍니다.
    const err = error as Error;
    console.error("MongoDB connection error:", err.message);

    process.exit(1);
    // 1 means failed, 0 means success
  }
}
