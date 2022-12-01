const { valid } = require("joi");
const Joi = require("joi");
const {
  JOI,
  USER_TYPE,
  WORK_TYPE,
  socialAuth,
  socialMedia,
  PUSH_NOTIFICATION_STATUS,
} = require("../../config/appConstants");

exports.login = {
  body: Joi.object()
    .keys({
      socialMedia: Joi.string().valid(...Object.values(socialMedia)),
    })
    .when(
      Joi.object({
        socialMedia: Joi.string().valid(socialMedia.TRUE),
      }).unknown(),
      {
        then: Joi.object().keys({
          socialId: Joi.object({
            googleId: Joi.string().required(),
          }),
          email: Joi.string(),
          name: Joi.string(),
          password: Joi.string(),
        }),
      },
      {
        then: Joi.object().keys({
          socialId: Joi.object({
            appleId: Joi.string(),
          }),
          email: Joi.string().required(),
          name: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      {
        then: Joi.object().keys({
          socialId: Joi.object({
            facebookId: Joi.string().valid(socialAuth.facebookId),
          }),
          email: Joi.string().required(),
          name: Joi.string().required(),
          password: Joi.string().required(),
        }),
      }
    )
    .when(
      Joi.object({
        socialMedia: Joi.string().valid(socialMedia.FALSE),
      }).unknown(),
      {
        then: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      }
    ),
};

exports.signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
    phoneNumber: JOI.PHONENUMBER,
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