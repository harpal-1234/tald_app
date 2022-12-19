const Joi = require("joi");
const { JOI ,BANNER_STATUS,DEALS_SERVICE} = require("../../config/appConstants");

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

exports.editStore = {
  body: Joi.object().keys({
    id:Joi.string().required(),
    storeName: Joi.string().required(),
    vendorId:Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
     category:Joi.string().valid(...Object.values(DEALS_SERVICE))
    }),
  }),
};

