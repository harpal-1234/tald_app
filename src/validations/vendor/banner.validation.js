const Joi = require("joi");
const { JOI ,DEALS_SERVICE} = require("../../config/appConstants");

exports.createBanner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    storeId:Joi.string().required(),
    description: Joi.string().optional(),
    service: Joi.object().keys({
      category:Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId:Joi.string()
     }),
    
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
  params: Joi.object().keys({
    id: Joi.string().required()
  }),

}