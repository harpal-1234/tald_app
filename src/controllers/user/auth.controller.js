import { userService, tokenService } from "../../services/index.js";
import config from "../../config/config.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} from "../../config/appConstants.js";
import { forgotPasswordEmail, verifyEmail } from "../../utils/sendMail.js";
import {
  successMessageWithoutData,
  successMessage,
} from "../../utils/commonFunction.js";
import dotenv from "dotenv";
dotenv.config();

const signUp = catchAsync(async (req, res) => {
  const newUser = await userService.createUser(req.body);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    newUser
  );
});
const register = catchAsync(async (req, res) => {
  const newUser = await userService.register(req.body);
  const token = await tokenService.generateAuthToken(
    newUser,
    USER_TYPE.USER,
    req.body.type
  );
  await verifyEmail(req.body.email, token.token);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    newUser,
    token
  );
});
const verifyMail = catchAsync(async (req, res) => {
  const token = req.query.token;
  const data = await userService.verifyEmails(token);

  if (data.isVerify == true) {
    return res.render("forgotPassword/commonMessage", {
      title: "Forgot Password",
      successMessage: "Verify mail successfully",
    });
  } else {
    return res.render("forgotPassword/commonMessage", {
      title: "Forgot Password",
      successMessage: "Failed",
    });
  }
});

const userLogin = catchAsync(async (req, res) => {
  const user = await userService.userLogin(req.body);
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
    user,
    token
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
  const token = await tokenService.generateResetPasswordToken(
    req.body.email,
    req.body.type
  );

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
const createService = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await userService.createService(userId, req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const getFilter = catchAsync(async (req, res) => {
  const filter = await userService.getFilter(req.query.type);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    filter
  );
});
const editProfile = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await userService.profileEdit(req.body, userId, req.token.token);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.VERIFY_EMAIL
  );
});
const getProfile = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await userService.getProfile(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const profile = catchAsync(async (req, res) => {
  const { token, name, email } = req.query;

  const data = await userService.profile(token, name, email);

  if (data) {
    return res.render("forgotPassword/commonMessage", {
      title: "Edit Profile",
      successMessage: "Your Profile successfully Updated",
      projectName: config.projectName,
    });
  } else {
    return res.render("forgotPassword/commonMessage", {
      title: "Edit Profile",
      successMessage: "something went wrong ,please try again",
      projectName: config.projectName,
    });
  }
});
const payments = catchAsync(async (req, res) => {
  const { amount, designerId, consultationId } = req.body;
  const userId = req.token.user._id;
  const users = await userService.payment(
    userId,
    amount,
    designerId,
    consultationId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users

    //user.phoneNumber
  );
});
const webhookApi = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripeSecret = "we_1O9o4rKs8Y4Y2av4XWVXUixx";
  const data = await userService.webhook(req.body, sig, stripeSecret);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const getDesignerSubscription = catchAsync(async (req, res) => {
  const data = await userService.getDesignerSubscription(req.token.user._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const createStripeConnectLink = catchAsync(async (req, res) => {
  const data = await userService.createStripeConnectLink(req.token.user._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const returnUrl = catchAsync(async (req, res) => {
  const data = await userService.return_url(req.query.accountId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const checkOutSession = catchAsync(async (req, res) => {
  const data = await userService.checkOutSession(
    req.token.user._id,
    req.query.priceId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const getSubscription = catchAsync(async (req, res) => {
  const data = await userService.getSubscription();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const createSubscription = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripeSecret = "we_1OAUcvKs8Y4Y2av4oiCKo6yA";
  const data = await userService.createSubscription(
    sig,
    stripeSecret,
    req.body
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
export default {
  signUp,
  register,
  verifyMail,
  userLogin,
  userLogout,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
  changePassword,
  userSocialLogin,
  createService,
  editProfile,
  profile,
  getProfile,
  getFilter,
  payments,
  webhookApi,
  createStripeConnectLink,
  returnUrl,
  checkOutSession,
  createSubscription,
  getSubscription,
  getDesignerSubscription,
};
