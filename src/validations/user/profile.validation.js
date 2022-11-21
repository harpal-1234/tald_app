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
    contactUsData: Joi.string().required()
  }),
};