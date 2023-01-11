const Joi = require("joi");
const { JOI, BANNER_STATUS ,DEALS_SERVICE} = require("../../config/appConstants");
const Joidate = require('joi').extend(require('@joi/date'));

exports.addCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required(),
  }),
};

exports.deleteCategory = {
  query: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

exports.deleteDeal = {
  query: Joi.object().keys({
    dealId: Joi.string().required(),
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


exports.editCategory = {
  body: Joi.object().keys({
    categoryId: Joi.string().required(),
    categoryImage: Joi.string().required(),
  }),
};
