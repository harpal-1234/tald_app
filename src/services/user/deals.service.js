const { successResponse } = require("../../utils/response");
const { User, Token, Admin, Coupon, Banner, Store } = require("../../models");
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
const {formatBanner,formatCoupon,formatResturant}=require("../../utils/commonFunction");

const homeData = async (req, res) => {
  const query = {
    "location.loc": {
      $near: {
        $geometry: { type: "Point", coordinates:  [ req.body.long, req.body.lat] },
        $maxDistance: 1000,
        // $maxDistance:1000
      },
    },
  }
  
  const [deals, banner, nearby] = await Promise.all([
    await Coupon.find({ isDeleted: false }).lean(),
    await Banner.find({ isDeleted: false }).lean(),
    await Store.find({query}).lean(),
  ]);

 const dealsData=formatCoupon(deals)
 const bannerData=formatCoupon(banner)
 const nearByData=formatCoupon(nearby)
  return { bannerData, dealsData, nearByData };
};



module.exports = {
  homeData,
};
