const { string } = require("joi");
const mongoose = require("mongoose");
const {MESSAGE_TYPE } = require("../config/appConstants");

const conversationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: { type: String },
    messageType:{type:String,enum: [...Object.values(MESSAGE_TYPE)] },
    messageTime: { type: String},
   // eventId:{ type: mongoose.Schema.Types.ObjectId, ref: "event" },

    isDeleted: { type: Boolean, default: false },
  
  },
  {
    timestamps: true,
  }
);
const conversation = mongoose.model("conversation", conversationSchema);

module.exports = conversation;