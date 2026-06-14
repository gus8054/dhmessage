import mongoose, { Document, Schema } from "mongoose";

// 1. 데이터의 형태(타입)를 정의하는 Interface를 먼저 만듭니다.
export interface MessageType extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string; // '?'는 필수가 아님(선택적)을 의미합니다.
  image?: string;
  video?: string;
  createdAt: Date; // timestamps: true 로 인해 자동 생성됨
  updatedAt: Date; // timestamps: true 로 인해 자동 생성됨
}

// 2. Schema를 생성할 때 <MessageType> 제네릭을 넘겨주어 타입을 연결합니다.
const messageSchema = new Schema<MessageType>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
  },
  { timestamps: true },
);

// 3. 모델을 생성할 때도 <MessageType> 타입을 연결합니다.
const Message = mongoose.model<MessageType>("Message", messageSchema);

export default Message;
