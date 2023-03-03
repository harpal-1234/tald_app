const Joi = require("joi");
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.createStore = {
  body: Joi.object().keys({
    businessName: Joi.string().required(),
    storeImage: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
      category: Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId: Joi.string(),
    }),
    storeType: Joi.string().required(),
    email: JOI.EMAIL,
    description: Joi.string().required(),
    countryCode: Joi.string().required(),
    phoneNumber: JOI.PHONENUMBER.optional(),
    about: Joi.string().required().optional(),
    type: Joi.string().required().optional(),
    // vendorId:Joi.string().required()
  }),
};

exports.deleteStore = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
exports.dashBoard = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search:Joi.string().allow(null).allow(''),
    startDate:Joi.string().allow(null).allow(''),
    endDate:Joi.string().allow(null).allow(''),
  }),
};

exports.editStoreDetails = {
  body: Joi.object().keys({
    businessName: Joi.string(),
    storeImage: Joi.string(),
    address: Joi.string(),
    lat: Joi.number(),
    long: Joi.number(),
    service: Joi.object().keys({
      category: Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId: Joi.string(),
    }),
    storeType: Joi.string(),
    email: JOI.EMAIL,
    description: Joi.string(),
    countryCode: Joi.string(),
    phoneNumber: JOI.PHONENUMBER.optional(),
    about: Joi.string().required().optional(),
    type: Joi.string().required().optional(),
  }),
};

exports.getStoreDetails = {
  body: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};
