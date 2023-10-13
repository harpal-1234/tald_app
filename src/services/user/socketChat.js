import { User, Chat, Conversation } from "../../models/index.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
export const oneConversation = async (conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    isDeleted: false,
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
    isDeleted: false,
    blocked: { $in: senderId },
  });

  const time = new Date();
  const saveMessage = await Chat.create({
    sender: senderId,
    receiver: receiverId,
    conversation: conversationId,
    message: message,
    type: type,
  });
  await Conversation.findOneAndUpdate(
    { _id: conversationId, isDeleted: false },
    { message: message, messageType: type, messageTime: time }
  );
  return saveMessage;
};
