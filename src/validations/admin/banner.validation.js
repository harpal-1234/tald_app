const Joi = require("joi");
const { JOI ,BANNER_STATUS} = require("../../config/appConstants");

exports.bannerRequest = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};



exports.bannerRequest = {
  body: Joi.object().keys({
    id:Joi.string().required(),
    status:Joi.string().valid(
        ...Object.values(BANNER_STATUS)
      )
  }),
};

exports.deleteBanner= {
  query: Joi.object().keys({
    id:Joi.string().required(),
  }),
};