const { vendorAdminService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  successMessageWithoutData,
  successMessage,
} = require("../../utils/commonFunction");
const { forgotPasswordEmail } = require("../../utils/mailSend");
const dotenv = require("dotenv");
dotenv.config();

const vendorLogin = catchAsync(async (req, res) => {

  const admin = await vendorAdminService.vendorLogin(req.body.email,req.body.password);
  const data = {
    businessName: admin.businessName,
    email: admin.email,
  };

  const token = await tokenService.generateAuthToken(
    admin,
    USER_TYPE.VENDOR_ADMIN
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    data,
    token
  );
});

// const adminLogin = catchAsync(async (req, res) => {
//   let { email, password } = req.body;
//   const admin = await vendorAdminService.adminLogin(email, password);
//   const token = await tokenService.generateAuthToken(
//     admin,
//     USER_TYPE.VENDOR_ADMIN
//   );
//   const user = {
//     Name: admin.userName,
//     email: admin.email,
//   };
//   return successResponse(
//     req,
//     res,
//     STATUS_CODES.SUCCESS,
//     SUCCESS_MESSAGES.DEFAULT,
//     user,
//     token
//   );
// });

const changePassword = catchAsync(async (req, res) => {

  await vendorAdminService.changePassword(
    req.token.vendor._id,
    req.body.oldPassword,
    req.body.newPassword
  );
  return successResponse(req, res, STATUS_CODES.SUCCESS);
});

const dashBoard = catchAsync(async (req, res) => {
  const data = await vendorAdminService.dashBoard(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    data
  );
});

const adminLogout = catchAsync(async (req, res) => {
  await vendorAdminService.adminLogout(req.token._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const getStoreDetails = catchAsync(async (req, res) => {
 const store= await vendorAdminService.getStoreDetails(req.token._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const forgotPassword = catchAsync(async (req, res) => {
  const token = await tokenService.generateVendorResetPassword(req.body.email);

  await forgotPasswordEmail(req.body.email, token.resetPasswordToken);
  return res.send(successMessageWithoutData(200, "Email successfully sent"));
});

//-------page render---------------//
const forgotPage = async (req, res) => {
  try {
    const tokenData = await tokenService.verifyResetPasswordToken(
      req.query.token
    );

    if (tokenData) {
      return res.render("passwordForgot/forgotPassword", {
        title: "forgot Password",
        token: req.query.token,
      });
    }
    res.render("passwordForgot/commonMessage", {
      title: "Forgot Password",
      errorMessage: "You have already changed your password",
      projectName: process.env.PROJECT_NAME,
    });
  } catch (error) {
    console.log(error);
    return res.send(
      successMessage(400, { msg: "Your password link has been expired" })
    );
  }
};

//-------resetPassword-----------//

const resetForgotPassword = catchAsync(async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await tokenService.verifyResetPasswordToken(token);
    if (!tokenData)
      return res.render("passwordForgot/commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expired",
        projectName: config.projectName,
      });

    const value = await vendorAdminService.resetPassword(
      tokenData,
      req.body.newPassword
    );

    return res.render("passwordForgot/commonMessage", {
      title: "Forgot Password",
      successMessage: "Your password is successfully changed",
      projectName: config.projectName,
    });
  } catch (error) {
    return res.render("passwordForgot/commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has been expired",
      projectName: config.projectName,
    });
  }
});

module.exports = {
  // adminLogin,
  changePassword,
  getStoreDetails,
  dashBoard,
  adminLogout,
  vendorLogin,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
};
