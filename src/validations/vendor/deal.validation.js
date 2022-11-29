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
    category:Joi.string().valid(
      ...Object.values(DEALS_SERVICE)
    )
  }),
};

exports.getAllDeal = {
  query: Joi.object().keys({
    page:Joi.number().optional(),
    limit:Joi.number().optional(),
    search:Joi.string().optional(),
  }),
};

exports.deleteDeal = {
  query: Joi.object().keys({
    id: Joi.string().required(), 
  }),
};
