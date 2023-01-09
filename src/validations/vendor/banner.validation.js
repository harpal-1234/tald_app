const Joi = require("joi");
const Joidate = require('joi').extend(require('@joi/date'));
const { JOI ,DEALS_SERVICE, BANNER_TYPE} = require("../../config/appConstants");

exports.createBanner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    bannerId:Joi.number().required(),
    startDate: Joidate.date().format('YYYY-MM-DD').utc(),
    endDate:Joidate.date().format('YYYY-MM-DD').utc(),
    service: Joi.object().keys({
      category:Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId:Joi.string()
     }),
     type:Joi.string().valid(...Object.values(BANNER_TYPE)),
    
  }),
};

exports.editBanner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    webLink: Joi.string().required(),
    service: Joi.object().keys({
      category:Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId:Joi.string()
     }),
  }),
};

exports.deleteBanner = {
  query: Joi.object().keys({
   id:Joi.string().required(),
  }),
};

exports.getBanner = {
  query: Joi.object().keys({
   id:Joi.string().required(),
  }),
};

exports.bannerRequest={
  query: Joi.object().keys({
    id: Joi.string().required()
  }),

}