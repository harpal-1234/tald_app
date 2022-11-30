const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.getAllVendor = {
query :Joi.object().keys({
  limit:Joi.string().optional(),
  page:Joi.string().optional(),
  skip:Joi.string().optional(),
  }),
};
