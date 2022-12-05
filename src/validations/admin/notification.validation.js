const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.createNotification = {
  body: Joi.object().keys({
    vendorId: Joi.string().required(),
    storeId: Joi.string().required(),
    image: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

exports.getAllNotification = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

exports.deleteNotification = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

exports.editNotification = {
  body: Joi.object().keys({
    vendorId: Joi.string().required(),
    storeId: Joi.string().required(),
    image: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
