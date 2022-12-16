const Joi = require("joi");
const { JOI ,BANNER_STATUS} = require("../../config/appConstants");

exports.addCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required()
  }),
};

exports.deleteCategory={
    query: Joi.object().keys({
      categoryId: Joi.string().required()
    }),
  };