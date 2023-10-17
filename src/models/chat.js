import mongoose from "mongoose";
import { MESSAGE_TYPE } from "../config/appConstants.js";

const chatSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "conversation" },
    message: { type: String, required: true },
    type: { type: String, enum: [...Object.values(MESSAGE_TYPE)] },
    mesageTime: { type: String },
    isChatDelete: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isBlocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("chat", chatSchema);

export { Chat };
