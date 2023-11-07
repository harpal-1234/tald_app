import mongoose from "mongoose";
import { MESSAGE_TYPE } from "../config/appConstants.js";

const conversationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: { type: String },
    messageType: { type: String, enum: [...Object.values(MESSAGE_TYPE)] },
    messageTime: { type: String },
    blocked: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        blockMessage: { type: String },
        blockMessageTime: { type: String },
        blockMessageType: {
          type: String,
          enum: [...Object.values(MESSAGE_TYPE)],
        },
        isDeleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      },
    ],

    isDeleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);
const Conversation = mongoose.model("conversations", conversationSchema);

export { Conversation };
