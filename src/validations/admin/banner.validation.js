const Joi = require("joi");
const { JOI ,BANNER_STATUS} = require("../../config/appConstants");

exports.bannerRequest = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};



exports.bannerRequest = {
  query: Joi.object().keys({
    bannerId:Joi.string().required(),
    // status:Joi.string().valid(
    //     ...Object.values(BANNER_STATUS)
    //   )
  }),
};
exports.payment = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow(null,""),
    startDate:Joi.string().allow(null,""),
    endDate:Joi.string().allow(null,""),
  }),
};
exports.getBanners = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow(null,""),
    startDate:Joi.string().allow(null,""),
    endDate:Joi.string().allow(null,""),
  }),
};
exports.deleteBanner= {
  query: Joi.object().keys({
    id:Joi.string().required(),
  }),
};