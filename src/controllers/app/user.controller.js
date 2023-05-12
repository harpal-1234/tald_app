const { userService, tokenService, appServices } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
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
module.exports = {
  getUser,
  filter,
  seeDistance,
  likeAndDislike,
  notification,
  conversation,
  checkOut,
  rewind,
};
