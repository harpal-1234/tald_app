const { adminNotificationService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  UPDATED_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const createNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.createNotification(
    req,
    res
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.NOTIFICATION_STATUS,
    notification
  );
});

const getAllNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.getAllNotification(
    req,
    res
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.NOTIFICATION_DETAILS,
    notification
  );
});

const editNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.editNotification(
    req,
    res
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    UPDATED_MESSAGES.NOTIFICATION_EDITED,
    notification
  );
});

const deleteNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.deleteNotification(
    req,
    res
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.NOTIFICATION_DELETED,
    notification
  );
});

module.exports = {
  createNotification,
  getAllNotification,
  editNotification,
  deleteNotification,
};
