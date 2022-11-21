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
const {successMessageWithoutData,successMessage}=require("../../utils/commonFunction")
const dotenv = require("dotenv");
dotenv.config();
//---------------login--------//

const login = catchAsync(async (req, res) => {
  let { email, password } = req.body;

  const user = await userService.userLogin(email, password);
  const token = await tokenService.generateAuthToken(user, USER_TYPE.USER);
  const employee = {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    email: user.email,
  };
  //   const formattedUser = commonServices.addressFormatter(user.toObject());
  // console.log(formattedUser);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    employee,
    token
  );
});

//---------------getProfile--------//
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.token.user._id);
  if (!user) {
    throw new OperationalError(
      
    );
  }
  const formatedUser = formatUser(user.toObject());
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    formatedUser
  );
  //return res.send(successMessage(httpStatus.OK, { user: formatedUser }));
});

//---------------changePassword--------//

const changePassword = catchAsync(async (req, res) => {
  
  const userdata = await User.findById(req.token.user._id);
  
  if (!userdata) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
 
  
  const user = await userService.changePassword(
    userdata.id,
    req.body.oldPassword,
    req.body.newPassword,
  );
 

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    CHANGE_PASSWORD.SUCCESS
  );
});

const editProfile = catchAsync(async (req, res) => {
  
 
  const data = await User.findById(
     {_id: req.token.user._id} 
  );
 
  if(!data)
  {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    )
  }
  
  const value = await commonService.editUser(req.body,req.file,data.id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    EDIT_MASSAGE.SUCCESS_EDIT
  );

});

//---------------refreshToken--------//

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await tokenService.refreshAuth(req.body.refreshToken);
  return res.send(successMessage(httpStatus.CREATED, tokens));
});

//---------------logout--------//

const logOut = catchAsync(async (req, res) => {
  const data = await tokenService.logout(req.token._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

//---------------deleteAccount--------//

const deleteAccount = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.token.user._id);
  await Token.findOneAndDelete({ user: req.token.user._id });
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.SUCCESS
  );
});

//------forgot password------------//

//-------send Email-------//
const forgotPassword = catchAsync(async (req, res) => {
  const token = await tokenService.generateResetPasswordToken(req.body.email);
  console.log("forgot password controller")
  await forgotPasswordEmail(req.body.email, token.resetPasswordToken);
  return res.send(successMessageWithoutData(200, "Email successfully sent"));
});

//-------page render---------------//
const forgotPage = async (req, res) => {
  try {
    console.log("forgotPage controller");
    console.log(req.query.token);
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
//--------------end-------------//


const getCustomerList=catchAsync(async(req,res) =>{
  const value =await commonService.getCustomerList(req,res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CUSTOMER_LIST,
    value
  );

});
const dashBoard=catchAsync(async(req,res) =>{
 
  const value =await commonService.dashBoard(req.token.user._id,req.query.date);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FREIGHT_LOADED,
    value
  );

});

const deleteImage=catchAsync(async(req,res) =>{
 
  const value =await commonService.deleteImage(req.token.user._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DELETE_IMAGE,
  );

});


module.exports = {
  login,
  getProfile,
  refreshToken,
  logOut,
  deleteAccount,
  changePassword,
  editProfile,
  forgotPage,
  resetForgotPassword,
  forgotPassword,
  dashBoard,
  getCustomerList,
  deleteImage
};
