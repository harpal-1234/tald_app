const { adminUserService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
  UPDATED_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const { formatUser } = require("../../utils/commonFunction");

const createUser = catchAsync(async (req, res) => {
  const vendor = await adminUserService.createUser(
    req.body,
    req.token.admin._id
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.VENDOR_ADMIN
  );
});

const getAllUser = catchAsync(async (req, res) => {
  let { page, limit, search, startDate, endDate } = req.query;
  const user = await adminUserService.getAllUser(
    page,
    limit,
    search,
    startDate,
    endDate
  )
  

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.ALL_USER,
    user.users,
    user.total
  );
});

const deleteUser = catchAsync(async (req, res) => {
  const vendor = await adminUserService.deleteUser(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.ADMIN_DELETED_USER
  );
});

const editUserProfile = catchAsync(async (req, res) => {
  const vendor = await adminUserService.editUserProfile(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    UPDATED_MESSAGES.USER_UPDATED
  );
});
module.exports = {
  createUser,
  getAllUser,
  deleteUser,
  editUserProfile,
};
