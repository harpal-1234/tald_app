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
  formatStore,
} = require("../../utils/commonFunction");
const io = require("socket.io");

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

  const [buffet, banner, men_clothing, resturant, bars, cannabis, shopping, beauty_spa, art_entertaiment, active_life, automotive, hotels,baby_kids,women_clothing,pets,electronics, sports_fitness] =
    await Promise.all([
      await Deal.find({ category: "buffet", isDeleted: false }).lean(),
      await Banner.find({ isDeleted: false }).lean(),
      await Store.find({ category: "Mens Clothing"}).lean(),
      await Store.find({ category: "Restaurants", query }).lean(),
      await Store.find({ category: "Bars", isDeleted: false }).lean(),
      await Store.find({ category: "Cannabis", isDeleted: false }).lean(),
      await Store.find({ category: "Shopping", isDeleted: false }).lean(),
      await Store.find({ category: "Beauty & Spas", isDeleted: false }).lean(),
      await Store.find({
        category: "Arts & Entertainment",
        isDeleted: false,
      }).lean(),
      await Store.find({ category: "Active Life", isDeleted: false }).lean(),
      await Store.find({ category: "Automotive", isDeleted: false }).lean(),
      await Store.find({ category: "Hotels", isDeleted: false }).lean(),
      await Store.find({ category: " Baby & Kids", isDeleted: false }).lean(),
      await Store.find({
        category: "Women’s Clothing",
        isDeleted: false,
      }).lean(),
      await Store.find({ category: "Pets", isDeleted: false }).lean(),
      await Store.find({ category: "Electronics", isDeleted: false }).lean(),
      await Store.find({
        category: "Sports & Fitness",
        isDeleted: false,
      }).lean(),
    ]);

    bars, 
    cannabis,
     shopping, 
     beauty_spa, 
     art_entertaiment, 
     active_life, 
     automotive,
      hotels,
      baby_kids,
      women_clothing,
      pets,
      electronics, 
      sports_fitness

  const buffetDeals = formatDeal(buffet);
  const bannerData = formatBanner(banner);
  const manClothingData=formatStore(men_clothing)
  const resturantData = formatResturant(resturant);
  const barData=formatStore(bars);
  const shoppingData=formatStore(shopping);
  const beautySpaData=formatStore(beauty_spa);
 
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

// const dealPurachse = async (req, res) => {
//   const deal = await Deal.findOne({
//     _id: req.body.id,
//     isDeleted: false,
//     isPurchase: false,
//   });
//   if (!deal) {
//     throw new OperationalError(
//       STATUS_CODES.NOT_FOUND,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }
//   const dealPurachse=await Deal.findOne({_id:req.body.id,is})
// };

const purchaseDeal = async (userId, dealId) => {
  const deal = await Deal.findOne({
    _id: dealId,
    isDeleted: false,
  });
  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }

  const purchaseDeal = await User.updateOne(
    { _id: userId },
    { $push: { dealPurchaseId: dealId } },
    { new: true }
  );

  return;
};

const storeDeal = async (storeId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const storeDeal = await Store.findOne({ _id: store.id, isDeleted: false })
    .populate({ path: "deals" })
    .lean();

  return storeDeal;
};

const favouriteStore = async (storeId,userId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const user=await User.findOne({_id:userId,isDeleted:false});

  if (user.favouriteStore.length) {
    user.favouriteStore.map(async (data) => {
      if (data.toString() === storeId) {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $pull: { favouriteStore: storeId } },
          { new: true }
        );
        return;
      } else {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $push: { favouriteStore: storeId } },
          { new: true }
        );
        return;
      }
    });
  } else {
    const favourite = await User.updateOne(
      { _id: user.id },
      { $push: { favouriteStore: storeId } },
      { new: true }
    );
    return;
  }
};

// const favouriteStore = async (req, res) => {
//   const user = await User.findOne({
//     _id: req.token.user._id,
//     isDeleted: false,
//   });
//   if (!user) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.ACCOUNT_NOT_EXIST
//     );
//   }

//   if (user.dealId.length) {
//     user.dealId.map(async (data) => {
//       if (data.toString() === req.body.dealId) {
//         const favourite = await User.updateOne(
//           { _id: user.id },
//           { $pull: { dealId: req.body.dealId } },
//           { new: true }
//         );
//         return;
//       } else {
//         const favourite = await User.updateOne(
//           { _id: user.id },
//           { $push: { dealId: req.body.dealId } },
//           { new: true }
//         );
//         return;
//       }
//     });
//   } else {
//     const favourite = await User.updateOne(
//       { _id: user.id },
//       { $push: { dealId: req.body.dealId } },
//       { new: true }
//     );
//     return;
//   }
// };

const reviewOrder=async(dealId,userId)=>{
  const deal =await Deal.findOne({_id:dealId,isDeleted:false});
  if(deal)
  {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );

  }
  const userDeal=await User.findone({_id:userId,isDeleted:false}).lean();
  const dealData=userDeal.dealPurchaseId.forEach(async(data)=>{
    if(data.string()===dealId)
    {
      return {dealId}
    }

  })
  const dealPurchase=await Deal.findOne({_id:dealData,isDeleted:false}).lean();

  return dealPurchase


}


module.exports = {
  notification,
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore,
  reviewOrder
};
