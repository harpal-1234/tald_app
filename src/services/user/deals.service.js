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
  
  const [buffet, banner, resturant,spa,clothing,cannabis,footwear] = await Promise.all([
    await Deal.find({ category:'buffet',isDeleted: false }).lean(),
    await Banner.find({ isDeleted: false }).lean(),
    await Store.find({query}).lean(),
    await Deal.find({category:'spa',isDeleted: false}).lean(),
    await Deal.find({category:'clothing',isDeleted: false}).lean(),
    await Deal.find({category:'cannabis',isDeleted: false}).lean(),
    await Deal.find({category:'footwear',isDeleted: false}).lean(),
  ]);

 const buffetDeals=formatCoupon(buffet);
 const bannerData=formatCoupon(banner);
 const resturantData=formatCoupon(resturant);
  return { buffetDeals, bannerData,resturantData,spa,clothing,cannabis,footwear};
};



module.exports = {
  homeData,
};
