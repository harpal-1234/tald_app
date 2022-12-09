const { Admin, Token, Banner, Notification } = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UPDATED_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const createNotification = async (data) => {
  if (
    await Notification.findOne({
      title: { $regex: RegExp(data.title, "i") },
      isDeleted:false
    })
  ) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOTIFICATION_DATA
    );
  }
  const notification = await Notification.create({
    vendorId: data.vendorId,
    dealId: data.dealId,
    storeId: data.storeId,
    image: data.image,
    title: data.title,
    description: data.description,
  });

  return notification;
};

const getAllNotification = async (data) => {
  const notification = await Notification.find({
    isDeleted: false,
  }).lean();

  if (!notification) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOTIFICATION_DATA
    );
  }

  return notification;
};

const editNotification = async (updateData) => {
  const notificationData = await Notification.findOne({
    _id: updateData.id,
    isDeleted: false,
  });

  if (!notificationData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOTIFICATION_DATA
    );
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: updateData.id },
    {
      vendorId: updateData.vendorId,
      dealId: updateData.dealId,
      storeId: updateData.storeId,
      image: updateData.image,
      title: updateData.title,
      description: updateData.description,
    },
    { upsert: false, new:true}
  );

  return notification;
};

const deleteNotification = async (data) => {
  console.log(data);
  const notificationData = await Notification.findOne({
    _id: data.id,
    isDeleted: false,
  });

  if (!notificationData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.NOTIFICATION_DATA
    );
  }
  const notification = await Notification.findOneAndUpdate(
    { _id: data.id },
    {
      isDeleted: true,
    },
    { upsert: false }
  );
  return;
};

module.exports = {
  createNotification,
  getAllNotification,
  editNotification,
  deleteNotification,
};
