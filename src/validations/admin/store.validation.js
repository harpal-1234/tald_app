const Joi = require("joi");
const { JOI ,BANNER_STATUS} = require("../../config/appConstants");

exports.getStoreDeal = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};

exports.deleteStore = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};