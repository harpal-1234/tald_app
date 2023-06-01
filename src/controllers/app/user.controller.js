const { userService, tokenService, appServices } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const callServices = require("../../utils/videoCall");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");

// const formatRes = require("../../../utils/formatResponse");
const {
  successMessageWithoutData,
  successMessage,
} = require("../../utils/commonFunction");
const { createStripeCustomer } = require("../../utils/stripe");
const dotenv = require("dotenv");
//const otpServices = require("../../utils/otp")
dotenv.config();

const getUser = catchAsync(async (req, res) => {
  const { lat, long } = req.query;
  const userId = req.token.user._id;
  const users = await appServices.getUsers(userId, lat, long);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users

    //user.phoneNumber
  );
});
const filter = catchAsync(async (req, res) => {
  const { distance, minAge, maxAge } = req.query;
  const userId = req.token.user._id;
  const users = await appServices.filter(distance, minAge, maxAge, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users
    //user.phoneNumber
  );
});
const seeDistance = catchAsync(async (req, res) => {
  const { type } = req.query;
  const userId = req.token.user._id;
  const users = await appServices.seeDistance(type, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users
    //user.phoneNumber
  );
});
const likeAndDislike = catchAsync(async (req, res) => {
  const { type, id } = req.query;
  const userId = req.token.user._id;
  const users = await appServices.likeAndDislike(type, id, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users
    //user.phoneNumber
  );
});
const notification = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const userId = req.token.user._id;
  const data = await appServices.notification(page, limit, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
    //user.phoneNumber
  );
});
const oneNotification = catchAsync(async (req, res) => {
  const {notificationId} = req.query;
  const data = await appServices.oneNotification(notificationId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
    //user.phoneNumber
  );
});
const conversation = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const userId = req.token.user._id;
  const data = await appServices.conversation(page, limit, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
    //user.phoneNumber
  );
});
const checkOut = catchAsync(async (req, res) => {
  const { packageType, packageAmount, plan } = req.body;
  const userId = req.token.user._id;
  const data = await appServices.checkOut(
    userId,
    packageType,
    packageAmount,
    plan
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
    //user.phoneNumber
  );
});
const rewind = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const userId = req.token.user._id;
  const data = await appServices.rewind(userId, page, limit);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
    //user.phoneNumber
  );
});
const check = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await appServices.checkApp(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
const oneUser = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const Id = req.token.user._id;
  const data = await appServices.oneUser(userId, Id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const upComingLikes = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const Id = req.token.user._id;
  const data = await appServices.upComingLikes(page, limit, Id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const call = catchAsync(async (req, res) => {
  const senderId = req.token.user._id;
  const { eventId, roomName, userId, state, type } = req.body;

  const value = await callServices.videoCall(roomName);
  if (state == "1") {
      const call = await NotificationServices.calls(
        value.tokentoken,
        value.videoGrant.room,
        userId,
        senderId,
        type,
      );
    
  }

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    value
  );
});
module.exports = {
  getUser,
  filter,
  seeDistance,
  likeAndDislike,
  notification,
  conversation,
  checkOut,
  rewind,
  check,
  oneUser,
  upComingLikes,
  oneNotification,
  call
};
