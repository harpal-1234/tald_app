const Joi = require("joi");
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.createStore = {
  body: Joi.object().keys({
    businessName: Joi.string().required(),
    storeImage:Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
     category:Joi.string().valid(...Object.values(DEALS_SERVICE)),
     categoryId:Joi.string()
    }),
    storeType:Joi.string().required(),
    email:JOI.EMAIL,
    description:Joi.string().required(),
    countryCode:Joi.string().required(),
    phoneNumber: JOI.PHONENUMBER.optional(),
    about: Joi.string().required().optional(),
    type:Joi.string().required().optional(),
    // vendorId:Joi.string().required()
  }),
};

exports.deleteStore = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};


exports.editStoreDetails = {
  body: Joi.object().keys({
    businessName: Joi.string().required(),
    storeImage:Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
     category:Joi.string().valid(...Object.values(DEALS_SERVICE)),
     categoryId:Joi.string()
    }),
    email:JOI.EMAIL,
    countryCode:Joi.string().required(),
    phoneNumber: JOI.PHONENUMBER.optional(),
    about: Joi.string().required().optional(),
    type:Joi.string().required().optional(),
    description:Joi.string().required().optional(),
    storeImage:Joi.string().required().optional(),
    storeType:Joi.string().required().optional(),

  }),
};

exports.getStoreDetails = {
  body: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
}