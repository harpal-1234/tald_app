import mongoose from "mongoose";
import { MESSAGE_TYPE } from "../config/appConstants.js";

const conversationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: { type: String },
    messageType: { type: String, enum: [...Object.values(MESSAGE_TYPE)] },
    messageTime: { type: String },
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    blockMessage: { type: String },
    blockMessageTime: { type: String },
    blockMessageType: { type: String, enum: [...Object.values(MESSAGE_TYPE)] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Conversation = mongoose.model("conversations", conversationSchema);

export { Conversation };
