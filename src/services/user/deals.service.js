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

const homeData = async (location, data) => {
  var recentValue = [];
  // const snapper = await Snapper.find({
  //   loc: {
  //     $near: {
  //       $geometry: {
  //         type: "Point",
  //         coordinates: [userBody.longitude, userBody.latitude],
  //       },
  //       $maxDistance: 100000,

  //       // $maxDistance:1000
  //     },
  //   },
  // });

  const [stores, featuredStore] = await Promise.all([
    Store.find({
      "service.category": { $nin: "Cannabis" },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.long, location.lat],
          },
          $maxDistance: 100000,
        },
      },
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .lean(),
    Store.find({
      "service.category": { $nin: "Cannabis" },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.long, location.lat],
          },
          $maxDistance: 100000,
        },
      },
      isDeleted: false,
    })
      .sort({ purchasedCount: -1 })
      .lean(),
  ]);

  // const valType=await User.find({query});
  // console.log(valType);
  //{"service.category": {$nin:"Cannabis"}
  const [banner, category, recentlyView, cannabis] = await Promise.all([
    Banner.find({ isDeleted: false }).sort({ _id: -1 }).lean(),
    Category.find({ isDeleted: false }).lean(),
    // Store.find({"service.category": {$nin:"Cannabis"},query,isDeleted: false }).sort({ _id: -1 }).lean(),
    User.findOne({ _id: data, isDeleted: false })
      .populate({ path: "recentlyView" })
      .lean(),
    Store.find({ "service.category": "Cannabis", isDeleted: false }).lean(),
  ]);

  // if (recentlyView) {
  //   recentValue = recentlyView.flatMap((data) => data.recentlyView);
  // } else {
  //   recentValue = recentlyView;
  // }

  // const topBannerData = formatBanner(banner);
  // const categoryData = formatCategory(category);
  // // const bannerData = formatBanner(bannerDown);
  // const storeData = formatStore(store);
  // const newStoreData = formatStore(newStore);
  // const recentlyViewData = formatRecentlyView(recentValue);
  // const cannabisData = formatStore(cannabis);

  const arrData = [
    {
      title: "Banner",
      data: banner,
    },
    {
      title: "Categories",
      data: category,
    },
    // {
    //   title: "Trending Deals",
    //   data: topBannerData,
    // },
    {
      title: "Featured Brands",
      data: featuredStore,
    },
    {
      title: "Newly Added",
      data: stores,
    },
    {
      title: "Recently Viewed",
      data: recentlyView.recentlyView,
    },
    // {
    //   title: "Cannabis",
    //   data: cannabisData,
    // },
  ];

  return arrData;
  // return {
  //   topBannerData,
  //   categoryData,
  //   bannerData,
  //   storeData,
  //   newStoreData,
  //   recentlyViewData,
  //   cannabisData,
  // };
};

const categoryData = async (data, userId) => {
  var recentValue;
  const [banner, store, newStore, recentlyView, cannabis] = await Promise.all([
    Banner.find({
      "service.categoryId": data.categoryId,
      isDeleted: false,
    }).lean(),
    Store.find({
      "service.categoryId": data.categoryId,
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [data.long, data.lat],
          },
          $maxDistance: 100000,
        },
      },
      isDeleted: false,
    })
      .sort({ purchasedCount: -1 })
      .lean(),
    Store.find({
      "service.categoryId": data.categoryId,
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [data.long, data.lat],
          },
          $maxDistance: 100000,
        },
      },
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .lean(),
    User.findOne({ _id: userId, isDeleted: false })
      .populate({ path: "recentlyView" })
      .lean(),
    // Store.find({
    //   "service.categoryId": data.categoryId,
    //   isDeleted: false,
    // }).lean(),
  ]);

  // if (recentlyView) {
  //   recentValue = recentlyView.flatMap((data) => data.recentlyView);
  // } else {
  //   recentValue = recentlyView;
  // }

  const bannerData = formatBanner(banner);
  const storeData = formatStore(store);
  const newStoreData = formatStore(newStore);
  // const recentlyViewData = formatRecentlyView(recentValue);
  // const cannabisData = formatStore(cannabis);

  const arrData = [
    {
      title: "banners",
      data: bannerData,
    },
    {
      title: "Featured Brands",
      data: storeData,
    },
    {
      title: "Newly Added",
      data: newStoreData,
    },
    {
      title: "Recently Viewed",
      data: recentlyView.recentlyView,
    },
    // {
    //   title: "Cannabis",
    //   data: cannabisData,
    // },
  ];

  return arrData;
  // return {
  //   bannerData,
  //   storeData,
  //   newStoreData,
  //   recentlyViewData,
  //   cannabisData,
  // };
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
const getStoreAndDeals = async (storeId, lat, long) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false }).lean();
  const deals = await Deal.find({ storeId: storeId, isDeleted: false });
  const lon1 = store.loc.coordinates.find((val, index) => {
    return val;
  });
  const lat1 = store.loc.coordinates.find((val, index) => {
    if (index == 1) {
      return val;
    }
  });

  const lat2 = lat;
  const lon2 = long;

  // convert coordinates to radians
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const radlon1 = (Math.PI * lon1) / 180;
  const radlon2 = (Math.PI * lon2) / 180;

  // calculate the difference between the coordinates
  const dLat = radlat2 - radlat1;
  const dLon = radlon2 - radlon1;

  // apply the Haversine formula
  const calculate =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radlat1) *
      Math.cos(radlat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const formula =
    2 * Math.atan2(Math.sqrt(calculate), Math.sqrt(1 - calculate));
  const distance = 6371 * formula; // result is in kilometers

  store.distance = distance;
  const storeData = formatStore(store);

  const data = [
    {
      title: "store",
      data: storeData,
    },
    {
      title: "deals",
      data: deals,
    },
  ];
  return data;
};
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
  const storeDeal = await Store.findOne({
    _id: store.id,
    isDeleted: false,
  }).lean();
  // .populate({ path: "deals" })
  // .lean();

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

  if (!userData.recentlyView.length) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { recentlyView: { $each: [storeId], $position: 0 } } },
      { new: true, upsert: false }
    );
  }
  if (userData.recentlyView.length < 5) {
    userData.recentlyView.map(async (data) => {
      if (data.toString() !== storeId) {
        await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { recentlyView: { $in: [storeId] } } },
          { upsert: false, new: true }
        );

        const userValue = await User.updateOne(
          { _id: userId },
          { $push: { recentlyView: { $each: [storeId], $position: 0 } } },
          { new: true }
        );
        return;
      }
      return;
    });

    if (userData.recentlyView.length < 5) {
      return userData.recentlyView.filter(
        (item, index) => userData.recentlyView.indexOf(item) === index
      );
    }

    // userData.recentlyView.filter(async (data) => {
    //   if (data.toString() === storeId) {
    //     console.log("working 23");
    //     await User.findOneAndUpdate(
    //       { _id: userId },
    //       { $pull: { recentlyView: {$in:[storeId]}}} ,
    //       { upsert: false,new:true }
    //     );

    //      await User.findOneAndUpdate(
    //       { _id: userId },
    //       { $push: { recentlyView: { $each: [storeId], $position: 0 } } },
    //       { upsert: false,new:true }
    //     );
    //     // console.log(userValue,"userValue");

    //     return;

    //   }

    //   return;
    // });

    return;
  } else if (userData.recentlyView.length >= 5) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          recentlyView: userData.recentlyView[userData.recentlyView.length - 1],
        },
      },
      { new: true }
    );
  }

  return;
};
const bookNow = async (deals, userId, storeId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  const check = user.addCard.find((value) => {
    return value;
  });

  if (check) {
    const data = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: { addCard: [] } }
    );
  }
  const value = await Promise.all(
    deals.map(async (val) => {
      let data = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { addCard: val } },
        { new: true }
      );
      return data;
    })
  );
  const [dealed, store] = await Promise.all([
    User.findOne({ _id: userId, isDeleted: false }).populate([
      {
        path: "addCard.dealId",
      },
    ]).lean(),
    Store.findOne({ _id: storeId ,isDeleted:false}).lean(),
  ]);
  let totalAmount = 0;
  dealed.addCard.forEach((val)=>{

    val.dealId.finalprice = val.dealId.totalPrice-val.dealId.discountPrice;
    val.dealId.quantity = val.quantity;
    if(val.quantity <= 2){
    totalAmount = totalAmount+val.dealId.finalprice*val.quantity

    }else{
      const quant = val.quantity
      totalAmount = totalAmount+val.dealId.finalprice*quant
    }
  });
const deal = [];
dealed.addCard.map((val)=>{
  deal.push(val.dealId)
 });
 const billDetails = {
  total:totalAmount,
  tax:totalAmount/100*110-totalAmount,
  amountPayable:totalAmount+(totalAmount/100*110-totalAmount)
 }
 
 
  
  return {deal,store,billDetails};
};

module.exports = {
  recentlyView,
  categoryData,
  notification,
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore,
  reviewOrder,
  getStoreAndDeals,
  bookNow,
};

// userData.recentlyView.map(async(data)=>{
//   console.log(data,"answer")
//   if(!data.toString() === storeId)
//   {
//     console.log("working")
//     if (userData.recentlyView.length < 5) {
//       {
//     const user = await User.updateOne(
//       { _id: userId },
//       { $push: { recentlyView:{$each :[storeId],$position: 0}}},
//       { new: true }
//     );
//     return
//       }
//     }
//   }

// })

// //   if (userData.recentlyView.length < 5) {
// //   const user = await User.updateOne(
// //     { _id: userId },
// //     { $push: { recentlyView:{$each :[storeId],$position: 0}}},
// //     { new: true }
// //   );
// //   return
// // }
// //   else{
// //   if (userData.recentlyView.length < 5) {
// //     const user = await User.updateOne(
// //       { _id: userId },
// //       { $push: { recentlyView:{$each :[storeId],$position: 0}}},
// //       { new: true }
// //     );

// //   }
// if (userData.recentlyView.length >= 5) {
//   const user = await User.updateOne(
//     { _id: userId },
//     { $pull: { recentlyView: userData.recentlyView[userData.recentlyView.length - 1]} },
//     { new: true }
//   );
//   userData.recentlyView.map(async(data)=>{
//     console.log(data,"answer")
//     if(!data.toString() === storeId)
//     {
//       console.log("working")
//       if (userData.recentlyView.length < 5) {
//         {
//       const user = await User.updateOne(
//         { _id: userId },
//         { $push: { recentlyView:{$each :[storeId],$position: 0}}},
//         { new: true }
//       );
//       return
//         }
//       }
//     }

//   })
// }
// return;
