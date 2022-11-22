const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.create = {
  body: Joi.object().keys({
    couponCode: Joi.string().required(), 
    name:Joi.string().required(), 
    worth: Joi.string().required(), 
    description: Joi.string().required(), 
    validFrom: Joi.string().required(), 
    validTo:Joi.string().required(),  
  
  }),
};

exports.getAllCoupon = {
  query: Joi.object().keys({
    page:Joi.number().allow(null).allow(''),
    limit:Joi.number().allow(null).allow(''),
    search:Joi.string().allow(null).allow(''),
  }),
};

exports.deleteCoupon = {
  query: Joi.object().keys({
    id: Joi.string().required(), 
  }),
};
