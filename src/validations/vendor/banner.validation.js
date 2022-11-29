const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.createBanner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    // webLink: Joi.string().required(),
  }),
};

exports.editBanner = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    webLink: Joi.string().required(),
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
  body: Joi.object().keys({
    id: Joi.string().required()
  }),

}