const { successResponse } = require("../../utils/response");
const { User, Token, Admin, Deal, Banner, Store } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  loginType,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const { userLocation } = require("./profile.service");
const {
  formatBanner,
  formatDeal,
  formatResturant,
} = require("../../utils/commonFunction");
const io=require("socket.io");

const homeData = async (req, res) => {
  const query = {
    "location.loc": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.body.long, req.body.lat],
        },
        $maxDistance: 1000,
      },
    },
  };

  const [buffet, banner, resturant, spa, clothing, cannabis, footwear] =
    await Promise.all([
      await Deal.find({ category: "buffet", isDeleted: false }).lean(),
      await Banner.find({ isDeleted: false }).lean(),
      await Store.find({query}).lean(),
      await Deal.find({ category: "spa", isDeleted: false }).lean(),
      await Deal.find({ category: "clothing", isDeleted: false }).lean(),
      await Deal.find({ category: "cannabis", isDeleted: false }).lean(),
      await Deal.find({ category: "footwear", isDeleted: false }).lean(),
    ]);

  const buffetDeals = formatDeal(buffet);
  const bannerData = formatBanner(banner);
  const resturantData = formatResturant(resturant);
  return {
    buffetDeals,
    bannerData,
    resturantData,
    spa,
    clothing,
    cannabis,
    footwear,
  };
};

const getCategoryData = async (req, res) => {
  const user = await User.findOne({
    _id: req.token.user._id,
    isDeleted: false,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const dealData = await Deal.find({
    category: req.query.category,
    isDeleted: false,
  }).lean();
  return dealData;
};

const nearestService = async (req, res) => {
  const user = await User.findOne({
    _id: req.token.user._id,
    isDeleted: false,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const nearestService = await Deal.find({ storeId: req.query.storeId }).lean();

  return nearestService;
};

const notification = async (req, res) => {
  const user = await User.findOne({
    _id: req.token.user._id,
    isDeleted: false,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
};

const dealPurachse = async (req, res) => {
  const deal = await Deal.findOne({
    _id: req.body.id,
    isDeleted: false,
    isPurchase: false,
  });
  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const dealPurachse=await Deal.findOne({_id:req.body.id,is})
};

module.exports = {
  notification,
  homeData,
  getCategoryData,
  nearestService,
};
