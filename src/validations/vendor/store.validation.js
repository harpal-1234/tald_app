const Joi = require("joi");
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.createStore = {
  body: Joi.object().keys({
    storeName: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
     category:Joi.string().valid(...Object.values(DEALS_SERVICE))
    }),
  }),
};

exports.deleteStore = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};


exports.editStoreDetails = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
    storeName: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
     category:Joi.string().valid(...Object.values(DEALS_SERVICE))
    }),
  }),
};
