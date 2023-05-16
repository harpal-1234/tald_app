const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};

exports.changePassword = {
  body: Joi.object().keys({
    oldPassword: JOI.PASSWORD,
    newPassword: JOI.PASSWORD,
  }),
};
exports.createGroup = {
  body: Joi.object().keys({
    groupName: Joi.string().required(),
    text: Joi.string().required(),
    image: Joi.string().required(),
  }),
};
exports.getGroup = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().required().allow(null, ""),
  }),
};
exports.getUser = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().required().allow(null, ""),
  }),
};
exports.userAction = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
exports.deleteGroup = {
  body: Joi.object().keys({
    groupId: Joi.string().required(),
  }),
};
