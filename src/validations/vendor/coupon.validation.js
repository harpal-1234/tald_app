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

exports.getCoupon = {
  query: Joi.object().keys({
    couponCode: Joi.string().required(), 
  
  }),
};

exports.deleteCoupon = {
  query: Joi.object().keys({
    id: Joi.string().required(), 
  }),
};
