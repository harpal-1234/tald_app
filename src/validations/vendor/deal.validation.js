const Joi = require("joi");
const Joidate = require("joi").extend(require("@joi/date"));
const { JOI, DEALS_SERVICE } = require("../../config/appConstants");

exports.create = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    dealId:Joi.string().required(),
    images: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().required()
      })
    ),
    description: Joi.string().required(),
    inclusions: Joi.string().required(),
    gender: Joi.string().required(),
    no_of_person: Joi.string().required(),
    totalPrice: Joi.number().required(),
    discountPrice: Joi.number().required(),
    validFrom: Joidate.date().format("YYYY-MM-DD").utc(),
    validTo: Joidate.date().format("YYYY-MM-DD").utc(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
      category: Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId: Joi.string().required(),
    }),
    dealDate: Joi.array().items(
      Joi.object().keys({
        day: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
      })
    ),
  }),
};

exports.editDeal = {
  body: Joi.object().keys({
    id:Joi.string().required(),
    title: Joi.string().required(),
    images: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().required()
      })
    ),
    description: Joi.string().required(),
    inclusions: Joi.string().required(),
    gender: Joi.string().required(),
    no_of_person: Joi.string().required(),
    totalPrice: Joi.number().required(),
    discountPrice: Joi.number().required(),
    validFrom: Joidate.date().format("YYYY-MM-DD").utc(),
    validTo: Joidate.date().format("YYYY-MM-DD").utc(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    service: Joi.object().keys({
      category: Joi.string().valid(...Object.values(DEALS_SERVICE)),
      categoryId: Joi.string().required(),
    }),
    dealDate: Joi.array().items(
      Joi.object().keys({
        day: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
      })
    ),
  }),
};

exports.getAllDeal = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().allow(null).allow(""),
    type:Joi.string().required().valid("active","deactive")
  }),
};

exports.deleteDeal = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
