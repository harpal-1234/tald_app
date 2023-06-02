const { successResponse } = require("../../utils/response");
const {
  User,
  Deal,
  Store,
  Chat,
  Notification,
  Conversation,
  Group,
} = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const { findOneAndUpdate } = require("../../models/token.model");
const calculateDistance = require("../../utils/distance");
const { date } = require("joi");
const notificationServices = require("../../utils/notification");

const saveMessages = async (
  senderId,
  receiverId,
  conversationId,
  message,
  type
) => {
  const receiver = [];

  receiver.push(receiverId);
  const time = new Date();
  const saveMessage = await Chat.create({
    sender: senderId,
    receiver: receiver,
    conversation: conversationId,
    message: message,
    type: type,
  });
};
const oneConversation = async (conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    isDeleted: false,
  });
  return conversation;
};
const saveGroupMessage = async (senderId, message, type, groupId) => {
  const group = await Group.findOne({ _id: groupId, isDeleted: false });
  const Ids = group.groupMember.filter(
    (id) => JSON.stringify(id) !== JSON.stringify(senderId)
  );
  const saveMessage = await Chat.create({
    sender: senderId,
    receiver:Ids,
    message: message,
    messageType: type,
    groupName: group.groupName,
    groupId: groupId,
    isGroup: true,
  });
  return saveMessage;
};
module.exports = {
  saveMessages,
  oneConversation,
  saveGroupMessage,
};
