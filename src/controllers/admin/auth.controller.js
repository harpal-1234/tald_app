import { adminService, tokenService } from "../../services/index.js";
import {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} from "../../config/appConstants.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";

export const adminLogin = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  const admin = await adminService.adminLogin(email, password);
  const newUser = {
    email: admin.email,
    _id: admin._id,
  };
  const token = await tokenService.generateAuthToken(
    admin,
    USER_TYPE.ADMIN,
    USER_TYPE.ADMIN
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    newUser,
    token
  );
});

export const userList = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const users = await adminService.userList(page, limit);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users
  );
});
export const vendorList = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const users = await adminService.vendorList(page, limit);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users
  );
});
export const requests = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const request = await adminService.requests(page, limit);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    request
  );
});
export const requestAction = catchAsync(async (req, res) => {
  let { status, requestId } = req.body;
  const request = await adminService.requestAction(status, requestId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    request
  );
});
export const userAction = catchAsync(async (req, res) => {
  let { userId } = req.body;
  const value = await adminService.userAction(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    value
  );
});
export const changePassword = catchAsync(async (req, res) => {
  await adminService.changePassword(
    req.token.admin._id,
    req.body.oldPassword,
    req.body.newPassword
  );
  return successResponse(req, res, STATUS_CODES.SUCCESS);
});

export const adminLogout = catchAsync(async (req, res) => {
  await adminService.adminLogout(req.token._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});
