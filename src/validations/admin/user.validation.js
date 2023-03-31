const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.createUser = {
    body: Joi.object().keys({
      email: Joi.string().optional(),
      name:Joi.string().optional(),
      password:Joi.string().optional(),
    }),
  };


exports.getAllUser = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow(null,""),
    startDate:Joi.string().allow(null,""),
    endDate:Joi.string().allow(null,""),
  }),
};

exports.deleteUser = {
  query: Joi.object().keys({
    id: Joi.string().optional(),
  }),
};

exports.editUserProfile = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    email: Joi.string().email().lowercase().trim().required(),
    name: Joi.string().required(),
  }),
};
exports.userAction = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    
  }),
};