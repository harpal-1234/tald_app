const Joi = require("joi");
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.create = {
  body: Joi.object().keys({
    couponCode: Joi.number().required(), 
    name:Joi.string().required(), 
    worth: Joi.number().required(), 
    description: Joi.string().required(), 
    validFrom: Joi.string().required(), 
    validTo:Joi.string().required(),
    storeId:Joi.string().required(),
    category:Joi.string().valid(
      ...Object.values(DEALS_SERVICE)
    )
  }),
};

exports.getAllDeal = {
  query: Joi.object().keys({
    page:Joi.number().allow(null).allow(''),
    limit:Joi.number().allow(null).allow(''),
    search:Joi.string().allow(null).allow(''),
  }),
};

exports.deleteDeal = {
  query: Joi.object().keys({
    id: Joi.string().required(), 
  }),
};
