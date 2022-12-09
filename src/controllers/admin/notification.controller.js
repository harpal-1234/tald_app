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
const {formatNotification}=require("../../utils/commonFunction")

const createNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.createNotification(
    req.body,
    res
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.NOTIFICATION_STATUS,
  );
});

const getAllNotification = catchAsync(async (req, res) => {
  const notification = await adminNotificationService.getAllNotification(
    req,
    res
  );
  const value=formatNotification(notification)
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
    req.body,
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
    req.query,
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
