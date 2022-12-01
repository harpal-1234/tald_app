const Joi = require("joi");
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.createStore = {
  body: Joi.object().keys({
    storeName: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.string().required(),
    long: Joi.string().required(),
    service: Joi.string().valid(...Object.values(DEALS_SERVICE)),
  }),
};

exports.deleteStore = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
