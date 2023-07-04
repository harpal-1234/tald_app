import { userService, tokenService } from "../../services/index.js";
import config from "../../config/config.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} from "../../config/appConstants.js";

// const formatRes = require("../../../utils/formatResponse");
import { forgotPasswordEmail, contactUs } from "../../utils/sendMail.js";
import {
  successMessageWithoutData,
  successMessage,
} from "../../utils/commonFunction.js";
//import { createStripeCustomer } from "../../utils/stripe.js";
import dotenv from "dotenv";
//import  otpServices = require("../../utils/otp")
dotenv.config();

const signUp = catchAsync(async (req, res) => {
  const newUser = await userService.createUser(req.body);
  // const newStripeCustomer=await createStripeCustomer(newUser);
  const data = {
    email: newUser.email,
    _id: newUser._id,
    type: req.body.type,
  };

  const token = await tokenService.generateAuthToken(
    newUser,
    USER_TYPE.USER,
    req.body.type
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data,
    token
  );
});

const userLogin = catchAsync(async (req, res) => {
  const user = await userService.userLogin(req.body);
  const data = {
    email: user.email,
    _id: user._id,
  };
  const token = await tokenService.generateAuthToken(
    user,
    USER_TYPE.USER,
    req.body.type
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data,
    token
    //user.phoneNumber
  );
});

const userSocialLogin = catchAsync(async (req, res) => {
  const newUser = await userService.userSocialLogin(req.body);
  const token = await tokenService.generateAuthToken(
    newUser,
    USER_TYPE.USER
    // req.body.deviceToken,
    // req.body.deviceType
  );

  const data = {
    name: newUser.name,
    email: newUser.email,
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
  const newUser = await userService.userLogout(req.token._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const forgotPassword = catchAsync(async (req, res) => {
  const token = await tokenService.generateResetPasswordToken(req.body.email,req.body.type);

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
const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(
    req.token.user._id,
    req.body.oldPassword,
    req.body.newPassword
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.PASSWORD_CHANGE
  );
});
const editProfile = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const user = await userService.editProfile(userId, req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});
const userContactUs = catchAsync(async (req, res) => {
  const { name, email, message } = req.body;
  const userDetails = await contactUs(name, message, email);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CONTACT_US
  );
});
export default {
  userSocialLogin,
  signUp,
  userLogin,
  userLogout,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
  changePassword,
  editProfile,
  userContactUs,
};
