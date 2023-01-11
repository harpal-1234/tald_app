const Joi = require("joi");
const Joidate = require('joi').extend(require('@joi/date'));
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.create = {
  body: Joi.object().keys({
    dealId: Joi.number().required(), 
    title:Joi.string().required(), 
    description: Joi.string().required(),
    inclusions:Joi.string().required(),
    // quantity: Joi.number().required(),  
    no_of_person:Joi.string().required(),
    totalPrice:Joi.number().required(), 
    discountPrice:Joi.number().required(), 
    validFrom: Joidate.date().format('YYYY-MM-DD').utc(),
    validTo:Joidate.date().format('YYYY-MM-DD').utc(),
    service:Joi.object().keys({
      category:Joi.string().valid(
        ...Object.values(DEALS_SERVICE)
      ),
      categoryId:Joi.string().required(),
    }),
    dealDate:Joi.array().items(
      Joi.object().keys({
        day:Joi.string().required(),
        startTime:Joi.string().required(),
        endTime:Joi.string().required(),
      })
    )

    })
    
  }

exports.editDeal= {
  body: Joi.object().keys({
    id:Joi.string().required(), 
    dealId: Joi.number().required(), 
    title:Joi.string().required(), 
    description: Joi.string().required(),
    inclusions:Joi.string().required(),
    // quantity: Joi.number().required(),  
    totalPrice:Joi.number().required(), 
    discountPrice:Joi.number().required(), 
    validFrom: Joidate.date().format('YYYY-MM-DD').utc(),
    validTo:Joidate.date().format('YYYY-MM-DD').utc(),
    service:Joi.object().keys({
      category:Joi.string().valid(
        ...Object.values(DEALS_SERVICE)
      ),
      categoryId:Joi.string().required(),
    }),
    dealDate:Joi.array().items(
      Joi.object().keys({
        day:Joi.string().required(),
        startTime:Joi.string().required(),
        endTime:Joi.string().required(),
      })
    )

    })
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
