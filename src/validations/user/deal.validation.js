const { valid } = require("joi");
const Joi = require("joi");
const {
 DEALS_SERVICE
} = require("../../config/appConstants");

exports.getCategoryData = {
  query: Joi.object().keys({
    category:Joi.string().valid(
        ...Object.values(DEALS_SERVICE)
      )
  }),
};

exports.nearestService = {
  query: Joi.object().keys({
    lat: Joi.string().required(),
    long: Joi.string().required(),
  }),
};