import mongoose, { Document, Schema } from "mongoose";

// 1. User 데이터의 설계도(Interface) 작성
export interface UserType extends Document {
  clerkId: string;
  email: string;
  fullName: string;
  profilePic: string; // default 값이 있으므로 무조건 문자열이 들어갑니다.
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema에 <UserType> 타입 연결
const userSchema = new Schema<UserType>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// 3. Model에 <User> 타입 연결
const User = mongoose.model<UserType>("User", userSchema);

export default User;
