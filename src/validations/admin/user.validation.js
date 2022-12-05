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
    limit: Joi.string().optional(),
    page: Joi.string().optional(),
    skip: Joi.string().optional(),
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
