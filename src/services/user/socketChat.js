import { User, Chat, Conversation } from "../../models/index.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
export const oneConversation = async (conversationId) => {
  console.log(conversationId,"IIIIIIDDDDDDDDDDDDD")
  const conversation = await Conversation.findOne({
    _id: conversationId,
  });
  return conversation;
};

export const saveMessages = async (
  senderId,
  receiverId,
  conversationId,
  message,
  type
) => {
  const check = await Conversation.findOne({
    _id: conversationId,
    blocked: { $in: senderId },
  });
  console.log(check,"chjeck check check ")
  if(check){
  if (JSON.stringify(check.isDeleted).includes(receiverId)) {
    await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $pull: { isDeleted: receiverId } }
    );
  }}

  const time = new Date();
  const saveMessage = await Chat.create({
    sender: senderId,
    receiver: receiverId,
    conversation: conversationId,
    message: message,
    messageTime: time,
    type: type,
  });
  await Conversation.findOneAndUpdate(
    { _id: conversationId },
    { message: message, messageType: type, messageTime: time }
  );
  const msg = await Chat.findOne({
    _id: saveMessage._id,
    isDeleted: false,
  })
    .populate([
      { path: "sender", select: ["name", "email"] },
      { path: "receiver", select: ["name", "email"] },
    ])
    .lean();
  msg.isEmit = JSON.stringify(check?.blocked)?.includes(senderId) ? false : true;
  return msg;
};
