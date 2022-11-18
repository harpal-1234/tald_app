const { userService,tokenService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE
} = require("../../config/appConstants");
// const formatRes = require("../../../utils/formatResponse");
const { forgotPasswordEmail } = require("../../utils/sendMail");
const {successMessageWithoutData}=require("../../utils/commonFunction")
const dotenv = require("dotenv");

const signUp= catchAsync(async (req, res) => {


  const newUser = await userService.createUser(req.body);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
  );
});

const userLogin= catchAsync(async (req, res) => {

  const newUser = await userService.userLogin(req.body.email,req.body.name,req.body.password,req.body.socialId);

  const token = await tokenService.generateAuthToken(newUser, USER_TYPE.USER);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    token
  );
});

const userLogout=catchAsync(async (req, res) => {
  
  const newUser = await userService.userLogout(req.token._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT,
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

module.exports = {
  signUp,
  userLogin,
  userLogout,
  forgotPassword,
  forgotPage,
  resetForgotPassword
};
