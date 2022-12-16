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
    storeId: Joi.string().required(),
  }),
};



exports.storeDeal= {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};

exports.purchaseDeal= {
  body: Joi.object().keys({
    dealId: Joi.string().required(),
  }),
};

exports.favouriteStore = {
  body: Joi.object().keys({
  storeId:Joi.string().required(),
  }),
};
