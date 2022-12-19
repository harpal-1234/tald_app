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

  const [
    buffet,
    banner,
    men_clothing,
    resturant,
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
    sports_fitness,
  ] = await Promise.all([
    await Deal.find({service:{ category: "buffet" }, isDeleted: false}).lean(),
    await Banner.find({service:{ category: "banner" },isDeleted:false}).lean(),
    await Store.find({service:{ category: "Mens Clothing" },isDeleted:false}).lean(),
    await Store.find({service:{ category: "Restaurants", query },isDeleted:false}).lean(),
    await Store.find({service:{ category: "Bars"}, isDeleted: false }).lean(),
    await Store.find({service:{ category: "Cannabis"}, isDeleted: false }).lean(),
    await Store.find({service:{ category: "Shopping" }, isDeleted: false}).lean(),
    await Store.find({service:{ category: "Beauty & Spas"}, isDeleted: false }).lean(),
    await Store.find({service:{
      category: "Arts & Entertainment",
    }, isDeleted: false}).lean(),
    await Store.find({service:{ category: "Active Life"}, isDeleted: false }).lean(),
    await Store.find({service:{ category: "Automotive"}, isDeleted: false }).lean(),
    await Store.find({service:{ category: "Hotels"}, isDeleted: false }).lean(),
    await Store.find({ service:{category: " Baby & Kids"}, isDeleted: false }).lean(),
    await Store.find({service:{
      category: "Women's Clothing"},
      isDeleted: false,
    }).lean(),
    await Store.find({service:{ category: "Pets"}, isDeleted: false }).lean(),
    await Store.find({service:{category: "Electronics"}, isDeleted: false }).lean(),
    await Store.find({service:{
      category: "Sports & Fitness"},
      isDeleted: false,
    }).lean(),
  ]);

  // bars,
  //   cannabis,
  //   shopping,
  //   beauty_spa,
  //   art_entertaiment,
  //   active_life,
  //   automotive,
  //   hotels,
  //   baby_kids,
  //   women_clothing,
  //   pets,
  //   electronics,
  //   sports_fitness;

  const buffetDeals = formatDeal(buffet);
  const bannerData = formatBanner(banner);
  const manClothingData = formatStore(men_clothing);
  const resturantData = formatResturant(resturant);
  const barData = formatStore(bars);
  const shoppingData = formatStore(shopping);
  const beautySpaData = formatStore(beauty_spa);
  const artEntertaimentData = formatStore(art_entertaiment);
  const activeLifeData = formatStore(active_life);
  const automotiveData = formatStore(automotive);
  const hotelData = formatStore(hotels);
  const babykidsData = formatStore(baby_kids);
  const womenClothingData = formatStore(women_clothing);
  const petsData = formatStore(pets);
  const electronicsData = formatStore(electronics);
  const sportsFitnessData = formatStore(sports_fitness);

  return {
    buffetDeals,
    bannerData,
    manClothingData,
    resturantData,
    barData,
    shoppingData,
    beautySpaData,
    artEntertaimentData,
    activeLifeData,
    automotiveData,
    hotelData,
    babykidsData,
    womenClothingData,
    petsData,
    electronicsData,
    sportsFitnessData,
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

const favouriteStore = async (storeId, userId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const user = await User.findOne({ _id: userId, isDeleted: false });

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

const reviewOrder = async (dealId, userId) => {
  const deal = await Deal.findOne({ _id: dealId, isDeleted: false });
  if (deal) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }
  const userDeal = await User.findone({ _id: userId, isDeleted: false }).lean();
  const dealData = userDeal.dealPurchaseId.forEach(async (data) => {
    if (data.string() === dealId) {
      return { dealId };
    }
  });
  const dealPurchase = await Deal.findOne({
    _id: dealData,
    isDeleted: false,
  }).lean();

  return dealPurchase;
};

module.exports = {
  notification,
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore,
  reviewOrder,
};
