const { vendorAdminService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const adminSignUp = catchAsync(async (req, res) => {
  const admin = await vendorAdminService.adminSignUp(req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
  );
});

const adminLogin = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  const admin = await vendorAdminService.adminLogin(email, password);
  const token = await tokenService.generateAuthToken(admin, USER_TYPE.VENDOR_ADMIN);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    token
  );
});

const changePassword = catchAsync(async (req, res) => {
  await vendorAdminService.changePassword(
    req.token.admin._id,
    req.body.oldPassword,
    req.body.newPassword
  );
  return successResponse(req, res, STATUS_CODES.SUCCESS);
});

const dashBoard = catchAsync(async (req, res) => {
  const data = await vendorAdminService.dashBoard();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    data
  );
});

const adminLogout=catchAsync(async (req,res) =>{
  console.log(req.token._id)
  await vendorAdminService.adminLogout(req.token._id)
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT,
    
    )
} )

module.exports = {
  adminLogin,
  changePassword,
  dashBoard,
  adminLogout,
  adminSignUp
};