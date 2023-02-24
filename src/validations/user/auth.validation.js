const { valid } = require("joi");
const Joi = require("joi");
const {
  JOI,
  USER_TYPE,
  WORK_TYPE,
  SOCIAL_LOGIN,
  PUSH_NOTIFICATION_STATUS,
  DEVICE_TYPE,
} = require("../../config/appConstants");

exports.login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password:Joi.string().min(6).required(),
    type:Joi.string().required().valid("User", "Vendor")
      // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  })
   
};
exports.logOut = {
  body: Joi.object().keys({
    type:Joi.string().required().valid("User", "Vendor")
      // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  })
   
};


exports.userSocialLogin = {
  body: Joi.object().keys({
    name: Joi.string().allow('', null),
    email: Joi.string().email().lowercase().trim().allow('', null),
    socialId:Joi.string().required(),
    type:Joi.string().required().valid("User", "Vendor")
  }),
};




exports.signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
    phoneNumber: JOI.PHONENUMBER,
    type:Joi.string().required().valid("User", "Vendor")
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};

exports.forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    // userType: Joi.string().required(),
  }),
};

exports.forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.resetForgotPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Password does not match" }),
  }),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),
};
exports.editprofile = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    password: Joi.string(),
    lastName: Joi.string(),
    profileImage: Joi.string(),
    phoneNumber: Joi.string()
      .max(10)
      .min(10)
      .message("Please enter a valid phone number"),
  }),
};

exports.pushNotificationStatus ={
  body: Joi.object().keys({
    pushNotification:Joi.string().valid(...Object.values(PUSH_NOTIFICATION_STATUS)),
  }),
}