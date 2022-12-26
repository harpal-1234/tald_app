const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.getAllVendor = {
  query: Joi.object().keys({
    limit: Joi.string().optional(),
    page: Joi.string().optional(),
    skip: Joi.string().optional(),
  }),
};

exports.deleteVendor = {
  query: Joi.object().keys({
    id: Joi.string().optional(),
  }),
};

exports.editVendorProfile = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    email: Joi.string().email().lowercase().trim().required(),
    userName: Joi.string().required(),
  }),
};