import { Request, Response } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export async function getUsersForSidebar(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // TS에서는 protectRoute를 거쳐왔더라도 여기서 req.user가 있는지 한 번 더 확인해 주는 것이 안전합니다.
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");

    res.status(200).json(filteredUsers);
  } catch (error) {
    const err = error as Error;
    console.error("Error in getUsersForSidebar:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationsForSidebar(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    const err = error as Error;
    console.error("Error in getConversationsForSidebar:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    const err = error as Error;
    console.error("Error in getMessages:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // TS에서는 변수를 미리 선언할 때 타입을 명시하거나 초기값을 주어야 합니다.
    let imageUrl: string | undefined;
    let videoUrl: string | undefined;

    // req.file은 우리가 이전에 @types/multer로 설정해둔 덕분에 자동 인식됩니다!
    if (req.file) {
      if (!hasImageKitConfig()) {
        res.status(500).json({ message: "Media upload is not configured" });
        return;
      }

      const url = await uploadChatMedia(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    const err = error as Error;
    console.error("Error in sendMessage:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
