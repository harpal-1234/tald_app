const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.getUser = {
  query: Joi.object().keys({
    lat: Joi.number().allow(null, ""),
    long: Joi.number().allow(null, ""),
  }),
};
exports.filter = {
  query: Joi.object().keys({
    distance: Joi.number().required(),
    maxAge: Joi.number().required(),
    minAge: Joi.number().required(),
  }),
};

exports.seeDistance = {
  query: Joi.object().keys({
    type: Joi.number().required().valid("Km", "Miles"),
  }),
};
exports.likeAndDislike = {
  query: Joi.object().keys({
    type: Joi.number().required().valid("Like", "Dislike"),
    id: Joi.string().required(),
  }),
};
exports.notifications = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
exports.checkOut = {
  body: Joi.object().keys({
    packageType: Joi.string().required().valid("Silver", "Gold", "Platinum"),
    packageAmount: Joi.string().required().allow(null, ""),
    plan: Joi.string().required().valid("Weekly", "Monthly", "Anualy"),
  }),
};
exports.rewind = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
exports.oneUser = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
