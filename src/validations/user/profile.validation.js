const { valid } = require("joi");
const Joi = require("joi");
const {
  JOI,
  USER_TYPE,
  WORK_TYPE,
  socialAuth,
  socialMedia,
} = require("../../config/appConstants");

exports.editprofile = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    type: Joi.string().required().valid("User", "Vendor"),
    phoneNumber: Joi.string()
      .max(10)
      .min(10)
      .message("Please enter a valid phone number"),
  }),
};

exports.userContactUs = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required().valid("User","Vendor"),
  }),
};

exports.userLocation = {
  body: Joi.object().keys({
    location: Joi.string(),
  }),
};
exports.changePassword = {
  body: Joi.object().keys({
    oldPassword:JOI.PASSWORD,
    newPassword:JOI.PASSWORD,
  }),
};
exports.favouriteStoreDeal = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};
