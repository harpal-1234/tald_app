import { Chat, Conversation } from "../../models/index.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";

export const getConversation = async (page, limit, userId) => {
  const skip = page * limit;
  const data = await Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }],
    isDeleted: { $nin: userId },
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ _id: 1 })
    .populate([
      {
        path: "sender",
        select: ["name", "email"],
      },
      {
        path: "receiver",
        select: ["name", "email"],
      },
    ]);

  if (data.length > 0) {
    // data.forEach((val) => {
    //   const pic = val.sender.images[0];
    //   val.sender.image = pic.image;
    //   delete val.sender.images;
    //   const pic1 = val.receiver.images[0]?val.receiver.images[0]:"";
    //   val.receiver.image = pic1.image;
    //   delete val.receiver.images;
    // });
    for (const value of data) {
      const chat = await Chat.find({
        conversation: value._id,
        isDeleted: false,
        isChatDelete: { $nin: userId },
      });
      if (chat.length <= 0) {
        delete value.message,
          delete value.messageType,
          delete value.messageTime;
        (value.message = ""),
          (value.messageTime = ""),
          (value.messageType = "");
      }
      if (JSON.stringify(value.blocked).includes(userId)) {
        if (value.blocked[0].user.equals(userId)) {
          console.log("first");
          delete value.message,
            delete value.messageType,
            delete value.messageTime;
          (value.message = value.blocked[0].blockMessage),
            (value.messageTime = value.blocked[0].blockMessageTime),
            (value.messageType = value.blocked[0].blockMessageType);
          value.isBlocked = true;
          delete value.blocked;
          console.log(value);
        } else {
          delete value.message,
            delete value.messageType,
            delete value.messageTime;
          (value.message = value.blocked[1].message),
            (value.messageTime = value.blocked[1].messageTime),
            (value.messageType = value.blocked[1].messageType);
          value.isBlocked = true;
          delete value.blocked;
        }
      } else {
        (value.isBlocked = false), delete value.blocked;
      }
    }
    return data;
  } else {
    return [];
  }
};
export const getChat = async (conversationId, userId, page, limit) => {
  const check = await Conversation.findOne({
    _id: conversationId,
    isDeleted: { $nin: userId },
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOT_FOUND
    );
  }

  const chat = await Chat.find({
    conversation: conversationId,
    isDeleted: false,
    isBlocked: { $nin: userId },
    isChatDelete: { $nin: userId },
  })
    .sort({ _id: -1 })
    .populate({ path: "sender", select: ["name", "email"] })
    .skip(page * limit)
    .limit(limit)
    .lean();

  return chat;
};

export const deleteChat = async (conversationId, userId) => {
  const check = await Conversation.findOne({
    _id: conversationId,
    isDeleted: { $nin: userId },
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOT_FOUND
    );
  }
  const chat = await Chat.updateMany(
    { conversation: conversationId, isDeleted: false },
    { $push: { isChatDelete: userId } },
    { new: true }
  );
  return chat;
};
export const blockUser = async (conversationId, userId) => {
  const check = await Conversation.findOne({
    _id: conversationId,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOT_FOUND
    );
  }

  if (!JSON.stringify(check.blocked).includes(userId)) {
    const chat = await Chat.find({
      conversation: conversationId,
      isDeleted: false,
      isBlocked: { $nin: userId },
      isChatDelete: { $nin: userId },
    });
    let msg;
    let msgType;
    let msgTime;
    if (chat.length > 0) {
      (msg = chat[chat.length - 1].message),
        (msgType = chat[chat.length - 1].type);
      msgTime = chat[chat.length - 1].mesageTime;
    } else {
      (msg = ""), (msgType = ""), (msgTime = "");
    }
    const data = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      {
        $push: {
          blocked: {
            user: userId,
            blockMessage: msg,
            blockMessageTime: msgTime,
            blockMessageType: msgType,
          },
        },
      }
    );
    return;
  }
  return;
};
export const unBlockUser = async (conversationId, userId) => {
  const check = await Conversation.findOne({
    _id: conversationId,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOT_FOUND
    );
  }
  const data = await Conversation.findOneAndUpdate(
    { _id: conversationId },
    {
      $pull: { blocked: { user: userId } },
    },
    { new: true }
  );
  return;
};
export const deleteConversation = async (conversationId, userId) => {
  const check = await Conversation.findOne({
    _id: conversationId,
    isDeleted: { $nin: userId },
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOT_FOUND
    );
  }
  const data = await Conversation.findOneAndUpdate(
    { _id: conversationId },
    {
      $push: { isDeleted: userId },
    },
    { new: true }
  );
  return;
};
