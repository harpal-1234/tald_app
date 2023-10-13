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
    isDeleted: false,
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
    }
    return data;
  } else {
    return [];
  }
};
export const getChat = async (conversationId, userId, page, limit) => {
  const check = await Conversation.findOne({
    _id: conversationId,
    isDeleted: false,
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