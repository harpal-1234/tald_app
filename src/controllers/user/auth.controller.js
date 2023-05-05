const { userService, tokenService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");

// const formatRes = require("../../../utils/formatResponse");
const { forgotPasswordEmail } = require("../../utils/sendMail");
const {
  successMessageWithoutData,
  successMessage,
} = require("../../utils/commonFunction");
const { createStripeCustomer } = require("../../utils/stripe");
const dotenv = require("dotenv");
//const otpServices = require("../../utils/otp")
dotenv.config();

const signUp = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const newUser = await userService.createUser(req.body, userId);
  // const newStripeCustomer=await createStripeCustomer(newUser);
  const data = {
    name: newUser.name,
    pushNotification: newUser.isPushNotification,
    phoneNumber: newUser.phoneNumber,
    isVerify: newUser.isVerify,
  };

  const token = await tokenService.generateAuthToken(
    newUser,
    " ",
    USER_TYPE.USER,
    data.phoneNumber
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    newUser,
    token
  );
});
const sendOtp = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;

  //const otp = await otpServices.otp(phoneNumber);

  let otpExpires = new Date();
  otpExpires.setSeconds(otpExpires.getSeconds() + 240);
  otp = { code: "0000", expiresAt: "" };
  // otp.code = 0000;
  otp.expiresAt = otpExpires;
  const user = await userService.createUserNumber(phoneNumber);
  const token = await tokenService.generateAuthToken(
    user,
    otp,
    USER_TYPE.USER,
    phoneNumber
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SEND_OTP,
    token
    //user.phoneNumber
  );
});
const verifyOtp = catchAsync(async (req, res) => {
  const { otp } = req.query;
  const tokenId = req.token._id;
  const userId = req.token.user._id;
  const data = await userService.verifyOtp(otp, tokenId, userId);
console.log(data)
  if (data) {
    const val = {
      phoneNumber: data.phoneNumber,
      _id: data._id,
      isVerify: data.isVerify,
    };
    const token = await tokenService.generateAuthToken(
      data,
      otp,
      USER_TYPE.USER,
      val.phoneNumber
    );
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      val,
      token

      //user.phoneNumber
    );
  }
});
const userLogin = catchAsync(async (req, res) => {
  // const newUser = await userService.userLogin(
  //   req.body.email,
  //   req.body.password,
  //   req.body.type
  // );
  const { phoneNumber } = req.body;
  const user = await userService.userLogin(phoneNumber);
  //const otp = await otpServices.otp(phoneNumber);

  let otpExpires = new Date();
  otpExpires.setSeconds(otpExpires.getSeconds() + 240);
  otp = { code: "0000", expiresAt: "" };
  // otp.code = 0000;
  otp.expiresAt = otpExpires;

  const token = await tokenService.generateAuthToken(
    user,
    otp,
    USER_TYPE.USER,
    phoneNumber
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SEND_OTP,
    token
    //user.phoneNumber
  );
});

const userSocialLogin = catchAsync(async (req, res) => {
  const newUser = await userService.userSocialLogin(req.body);
  const token = await tokenService.generateAuthToken(
    newUser,
    "",
    USER_TYPE.USER,
    // req.body.deviceToken,
    // req.body.deviceType
  );

  const data = {
    name: newUser.name,
    email: newUser.isVerify,
    pushNotification: newUser.isPushNotification,
    phoneNumber: newUser.phoneNumber,
  };

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    newUser,
    token
  );
});

const userLogout = catchAsync(async (req, res) => {
  const newUser = await userService.userLogout(req.token._id, req.body.type);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const forgotPassword = catchAsync(async (req, res) => {
  const token = await tokenService.generateResetPasswordToken(req.body.email);

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
      return res.render("forgotPassword/forgotPassword", {
        title: "forgot Password",
        token: req.query.token,
      });
    }
    res.render("forgotPassword/commonMessage", {
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
      return res.render("forgotPassword/commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expired",
        projectName: config.projectName,
      });

    const value = await userService.resetPassword(
      tokenData,
      req.body.newPassword
    );

    return res.render("forgotPassword/commonMessage", {
      title: "Forgot Password",
      successMessage: "Your password is successfully changed",
      projectName: config.projectName,
    });
  } catch (error) {
    return res.render("forgotPassword/commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has been expired",
      projectName: config.projectName,
    });
  }
});

const pushNotification = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const notification = await userService.pushNotification(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    notification
  );
});

module.exports = {
  userSocialLogin,
  signUp,
  userLogin,
  userLogout,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
  pushNotification,
  sendOtp,
  verifyOtp,
};
