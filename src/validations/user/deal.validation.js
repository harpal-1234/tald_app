const { valid } = require("joi");
const Joi = require("joi");
const {
 DEALS_SERVICE
} = require("../../config/appConstants");

exports.getCategoryData = {
  query: Joi.object().keys({
    category:Joi.string().valid(
        ...Object.values(DEALS_SERVICE)
      )
  }),
};

exports.nearestService = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};
exports.storeAndDeals = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }),
};


exports.storeDeal= {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};

exports.purchaseDeal= {
  body: Joi.object().keys({
    dealId: Joi.string().required(),
  }),
};

exports.favouriteStore = {
  body: Joi.object().keys({
  storeId:Joi.string().required(),
  }),
};
exports.bookNow = {
  body: Joi.object().keys({
    deals: Joi.array()
      .items(
        Joi.object()
          .keys({
            dealId: Joi.string().required(),
            quantity:Joi.number().required()
          })
          .required()
      )
      .required(),
      storeId:Joi.string().required()
  }),
};

exports.categoryData={
  query:Joi.object().keys({
    // service:Joi.object().keys({
      // category:Joi.string().required(),
      categoryId:Joi.string().required(),
      lat:Joi.number().required(),
      long:Joi.number().required()
    // })
    })
}
