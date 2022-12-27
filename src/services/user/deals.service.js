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
const { Category } = require("../../models");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const { userLocation } = require("./profile.service");
const {
  formatBanner,
  formatDeal,
  formatResturant,
  formatStore,
  formatCategory,
  formatUser,
  recentlyViewFormat,
  formatRecentlyView,
} = require("../../utils/commonFunction");
const io = require("socket.io");

const homeData = async (data) => {
  var recentValue;

  const query = {
    "location.loc": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [data.long, data.lat],
        },
        $maxDistance: 1000,
      },
    },
  };

  const [
    banner,
    category,
    bannerDown,
    store,
    newStore,
    recentlyView,
    cannabis,
  ] = await Promise.all([
    Banner.find({ type: "Promoted", isDeleted: false }).lean(),
    Category.find({ isDeleted: false }).lean(),
    Banner.find({ type: "Casual", isDeleted: false }).lean(),
    Store.find({ isDeleted: false }).lean(),
    Store.find({ isDeleted: false }).sort({ _id: -1 }).lean(),
    User.find({ _id: data, isDeleted: false })
      .populate({ path: "recentlyView" })
      .lean(),
    Store.find({ isDeleted: false }).lean(),
  ]);
 


  if (recentlyView) {
    recentValue = recentlyView.flatMap((data) => data.recentlyView);
  } else {
    recentValue = recentlyView;
  }
 

  const topBannerData = formatBanner(banner);
  const categoryData = formatCategory(category);
  const bannerData = formatBanner(bannerDown);
  const storeData = formatStore(store);
  const newStoreData = formatStore(newStore);
  const recentlyViewData = formatRecentlyView(recentValue);
  const cannabisData = formatStore(cannabis);
     
  return {
    topBannerData,
    categoryData,
    bannerData,
    storeData,
    newStoreData,
    recentlyViewData,
    cannabisData,
  };
};

const categoryDealData = async (data,userId) => {
  var recentValue;
  const [banner, store, newStore, recentlyView, cannabis] =
    await Promise.all([
      Banner.find({
        "service.categoryId": data.categoryId,
        type: "Promoted",
        isDeleted: false,
      }).lean(),
      Store.find({
        "service.categoryId": data.categoryId,
        isDeleted: false,
      }).lean(),
      Store.find({ "service.categoryId": data.categoryId, isDeleted: false })
        .sort({ _id: -1 })
        .lean(),
      User.find({ _id: userId, isDeleted: false }).populate({ path: "recentlyView" }).lean(),
      Store.find({
        "service.categoryId": data.categoryId,
        isDeleted: false,
      }).lean(),
    ]);


    if (recentlyView) {
      recentValue = recentlyView.flatMap((data) => data.recentlyView);
    } else {
      recentValue = recentlyView;
    }

  const bannerData = formatBanner(banner);
  const storeData = formatStore(store);
  const newStoreData = formatStore(newStore);
  const recentlyViewData = formatRecentlyView(recentValue);
  const cannabisData = formatStore(cannabis);

  return {
    bannerData,
    storeData,
    newStoreData,
    recentlyViewData,
    cannabisData,
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

  if (user.favouriteStores.length) {
    user.favouriteStores.map(async (data) => {
      if (data.toString() === storeId) {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $pull: { favouriteStores: storeId } },
          { new: true }
        );
        return;
      } else {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $push: { favouriteStores: storeId } },
          { new: true }
        );
        return;
      }
    });
  } else {
    const favourite = await User.updateOne(
      { _id: user.id },
      { $push: { favouriteStores: storeId } },
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

const recentlyView = async (storeId, userId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const userData = await User.findOne({ _id: userId, isDeleted: false });

  if (userData.recentlyView.length < 10) {
    const user = await User.updateOne(
      { _id: userId },
      { $push: { recentlyView: storeId } },
      { new: true }
    );
  }
  if (userData.recentlyView.length >= 10) {
    const user = await User.updateOne(
      { _id: userId },
      { $pull: { recentlyView: storeId } },
      { new: true }
    );
  }
  return;
};

module.exports = {
  recentlyView,
  categoryDealData,
  notification,
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore,
  reviewOrder,
};
