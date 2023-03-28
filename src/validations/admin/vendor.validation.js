const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.getAllVendor = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow(null,""),
    startDate:Joi.string().allow(null,""),
    endDate:Joi.string().allow(null,""),
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
