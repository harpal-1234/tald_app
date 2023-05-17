const { adminService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const adminLogin = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  const admin = await adminService.adminLogin(email, password);
  const token = await tokenService.generateAuthToken(
    admin,
    "",
    USER_TYPE.ADMIN
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    token
  );
});

const changePassword = catchAsync(async (req, res) => {
  await adminService.changePassword(
    req.token.admin._id,
    req.body.oldPassword,
    req.body.newPassword
  );
  return successResponse(req, res, STATUS_CODES.SUCCESS);
});

const dashBoard = catchAsync(async (req, res) => {
  const adminId = req.token._id;

  const data = await adminService.dashBoard(adminId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const adminLogout = catchAsync(async (req, res) => {
  await adminService.adminLogout(req.token._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});
const createGroup = catchAsync(async (req, res) => {
  const group = await adminService.createGroup(req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    group
  );
});
const getGroup = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const group = await adminService.getGroup(page, limit, search);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    group
  );
});
const getUser = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const user = await adminService.getUser(page, limit, search);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const allUser = catchAsync(async (req, res) => {
  const {search} = req.query;
  const user = await adminService.allUser(search);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const userAction = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await adminService.userActions(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const userDelete = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await adminService.userDelete(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const deleteGroup = catchAsync(async (req, res) => {
  const { groupId } = req.body;
  const user = await adminService.groupDelete(groupId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const dashboard = catchAsync(async (req, res) => {
  // const {groupId}=req.body
  const user = await adminService.dashBoard();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
module.exports = {
  adminLogin,
  changePassword,
  dashBoard,
  adminLogout,
  createGroup,
  getGroup,
  getUser,
  userAction,
  userDelete,
  deleteGroup,
  dashboard,
  allUser
};
