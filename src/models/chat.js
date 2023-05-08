const { string } = require("joi");
const mongoose = require("mongoose");
const { MESSAGE_TYPE } = require("../config/appConstants");

const chatSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "conversation" },
    message: { type: String, required: true },
    type: { type: String, enum: [...Object.values(MESSAGE_TYPE)] },
    groupId: { type: String },
    isGroup: { type: Boolean, default: false },
    isChatDelete: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isBlocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const chat = mongoose.model("chat", chatSchema);

module.exports = chat;
