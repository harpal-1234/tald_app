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
    blocked: { $in: senderId },
  });
  if (JSON.stringify(check.isDeleted).includes(receiverId)) {
    await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $pull: { isDeleted: receiverId } }
    );
  }

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
    { _id: conversationId, isDeleted: false },
    { message: message, messageType: type, messageTime: time }
  );
  saveMessage.toObject().isEmit = JSON.stringify(check.blocked).includes(
    senderId
  )
    ? false
    : true;
  return saveMessage;
};
