const Joi = require("joi");
const Joidate = require('joi').extend(require('@joi/date'));
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.create = {
  body: Joi.object().keys({
    couponCode: Joi.number().required(), 
    name:Joi.string().required(), 
    worth: Joi.number().required(), 
    description: Joi.string().required(),
    quantity: Joi.number().required(),  
    validFrom: Joidate.date().format('YYYY-MM-DD').utc(),
    validTo:Joidate.date().format('YYYY-MM-DD').utc(),
    storeId:Joi.string().required(),
    category:Joi.string().valid(
      ...Object.values(DEALS_SERVICE)
    )
  }),
};

exports.editDeal= {
  body: Joi.object().keys({
    id: Joi.string().required(), 
    vendorId:Joi.string().required(), 
    couponCode: Joi.number().required(), 
    name:Joi.string().required(), 
    worth: Joi.number().required(), 
    description: Joi.string().required(),
    quantity: Joi.number().required(), 
    validFrom: Joidate.date().format('YYYY-MM-DD').utc(),
    validTo:Joidate.date().format('YYYY-MM-DD').utc(),
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
