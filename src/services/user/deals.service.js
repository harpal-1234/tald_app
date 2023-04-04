const { successResponse } = require("../../utils/response");
const {
  User,
  Token,
  Admin,
  Deal,
  Banner,
  Store,
  Notification,
} = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const stripeServices = require("../../middlewares/stripe");
const shortid = require("shortid");
var moment = require("moment");
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
const notificationServices = require("./../../utils/notification");
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
const { findOneAndUpdate } = require("../../models/token.model");

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
      title: "Banners",
      data: banner,
    },
    { title: "Categories", data: category },
    { title: "Featured Brands", data: featuredStore },
    { title: "Newly Added", data: stores },
    { title: "Recently Viewed", data: recentlyView.recentlyView },
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
const cannabisCategoryData = async (data, userId) => {
  var recentValue;
  const catagory = await Category.find({ category: "Cannabis" });
  const Id = catagory.find((val) => val);

  const store = await Store.find({
    "service.categoryId": Id._id,
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
  }).lean();

  console.log(store);

  const storeData = formatStore(store);

  return storeData;
  return {
    bannerData,
    storeData,
    newStoreData,
    recentlyViewData,
    cannabisData,
  };
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

  // const arrData = {
  //   banners: bannerData,
  //   FeaturedBrands: storeData,
  //   NewlyAdded: newStoreData,
  //   RecentlyViewed: recentlyView.recentlyView,
  // };
  // if (storeData.length < 0) {
  storeData.forEach((val) => {
    val.storeId = val._id;
  });
  // }
  if (newStoreData.length > 0) {
    newStoreData.forEach((val) => {
      val.storeId = val._id;
    });
  }
  // console.log(recentlyView.recentlyView.length)
  if (recentlyView.recentlyView.length > 0) {
    recentlyView.recentlyView.forEach((val) => {
      val.storeId = val._id;
    });
  }
  const arrData = [
    {
      title: "Banners",
      data: bannerData,
    },
    { title: "Featured Brands", data: storeData },
    { title: "Newly Added", data: newStoreData },
    { title: "Recently Viewed", data: recentlyView.recentlyView },
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
const getStoreAndDeals = async (storeId, lat, long, userId) => {
  const [store, deals, user] = await Promise.all([
    Store.findOne({ _id: storeId, isDeleted: false }).lean(),
    Deal.find({ storeId: storeId, isDeleted: false }).lean(),
    User.findOne({ _id: userId, isDeleted: false }).lean(),
  ]);

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

  store.distance = distance.toFixed(1);

  const storeData = formatStore(store);
  if (!JSON.stringify(user.recentlyView).includes(storeId)) {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $push: { recentlyView: storeId } }
    );
  }

  if (deals.length > 0) {
    deals.forEach((val) => {
      val.quantity = 0;
    });
  }

  if (
    !JSON.stringify(user.favouriteStores).includes(JSON.stringify(store._id))
  ) {
    storeData.isFavourite = false;
  } else {
    storeData.isFavourite = true;
  }
  const data = {
    store: storeData,
    deals: deals,
  };
  return data;
};
const purchaseDeal = async (userId, lat, long, page, limit) => {
  const deal = await User.findOne({
    _id: userId,
    isDeleted: false,
  })
    .populate([
      {
        path: "dealPurchases.storeId",
        select: [
          "storeImage",
          "businessName",
          "storeType",
          "service",
          "loc",
          "description",
          "phoneNumber",
          "countryCode",
          "rating",
        ],
      },
      {
        path: "dealPurchases.deals.dealId",
        select: [
          "dealId",
          "title",
          "totalPrice",
          "discountPrice",
          "no_of_person",
          "service",
        ],
      },
    ])
    .lean();

  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }
  const longtitude = deal.dealPurchases.map((val) => {
    return val.storeId.loc.coordinates.find((val, index) => val);
  });

  const latatitude = deal.dealPurchases.map((val) => {
    return val.storeId.loc.coordinates.find((val, index) => {
      if (index == 1) {
        return val;
      }
    });
  });
  const lon1 = longtitude.find((val) => val);
  const lat1 = latatitude.find((val) => val);

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
  console.log(distance);

  deal.dealPurchases.forEach((val) => {
    val.storeId.distance = distance.toFixed(1);
  });
  const lim = page + 1;

  const skip = page * limit;

  const Deals = deal.dealPurchases.filter((value, index) => {
    if (index >= skip && index < limit * lim) {
      return value;
    }
  });

  return Deals;
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
  const [store, user] = await Promise.all([
    Store.findOne({ _id: storeId, isDeleted: false }),
    User.findOne({ _id: userId, isDeleted: false }),
  ]);
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }

  if (!JSON.stringify(user.favouriteStores).includes(storeId)) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { favouriteStores: storeId } }
    );
    return true;
  } else {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favouriteStores: storeId } }
    );
    return false;
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
    User.findOne({ _id: userId, isDeleted: false })
      .populate([
        {
          path: "addCard.dealId",
        },
      ])
      .lean(),
    Store.findOne({ _id: storeId, isDeleted: false }).lean(),
  ]);
  let totalAmount = 0;
  dealed.addCard.forEach((val) => {
    val.dealId.finalprice = val.dealId.totalPrice - val.dealId.discountPrice;
    val.dealId.quantity = val.quantity;
    if (val.quantity <= 2) {
      totalAmount = totalAmount + val.dealId.finalprice * val.quantity;
    } else {
      const quant = val.quantity;
      totalAmount = totalAmount + val.dealId.finalprice * quant;
    }
  });
  const deal = [];
  dealed.addCard.map((val) => {
    deal.push(val.dealId);
  });
  const billDetails = {
    total: totalAmount,
    tax: (totalAmount / 100) * 110 - totalAmount,
    amountPayable: totalAmount + ((totalAmount / 100) * 110 - totalAmount),
  };

  return { deal, store, billDetails };
};
const payment = async (amount, userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });

  const ephemeralKey = await stripeServices.stripeServices(user.stripeId);
  const paymentIntent = await stripeServices.paymentIntent(
    user.stripeId,
    amount
  );
  const customer = paymentIntent.customer;
  return { ephemeralKey, paymentIntent, customer };
};
const checkOut = async (paymentId, userId, amount) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  const check = await User.findOne({ _id: userId, isDeleted: false }).populate({
    path: "addCard.dealId",
  });
  if (user.addCard == 0) {
    return "Please add items your card";
  }
  const storeId = check.addCard.find((val) => {
    //console.log(val)
    return val.dealId.storeId;
  });

  // const ephemeralKey = await stripeSerbices.stripeServices(user.stripeId);
  // const paymentIntent = await stripeSerbices.paymentIntent(
  //   user.stripeId,
  //   amount
  // );
  // // const check = user.addCard.find((value) => {
  //   return value;
  // });

  // if (check) {
  //   const data = await User.findOneAndUpdate(
  //     { _id: userId, isDeleted: false },
  //     { $set: { addCard: [] } }
  //   );
  // }
  // const value = await Promise.all(
  //   deals.map(async (val) => {
  //     let data = await User.findOneAndUpdate(
  //       { _id: userId },
  //       { $push: { addCard: val } },
  //       { new: true }
  //     );
  //     return data;
  //   })
  // );
  let totalDeals = 0;
  const [dealed, store] = await Promise.all([
    User.findOne({ _id: userId, isDeleted: false })
      .populate([
        {
          path: "addCard.dealId",
        },
      ])
      .lean(),
    Store.findOne({ _id: storeId.dealId.storeId, isDeleted: false }).lean(),
  ]);
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  let totalAmount = 0;
  dealed.addCard.forEach((val) => {
    val.dealId.finalprice = val.dealId.totalPrice - val.dealId.discountPrice;
    val.dealId.quantity = val.quantity;
    if (val.quantity <= 2) {
      totalAmount = totalAmount + val.dealId.finalprice * val.quantity;
    } else {
      const quant = val.quantity;
      totalAmount = totalAmount + val.dealId.finalprice * quant;
    }
  });
  const deal = [];

  dealed.addCard.map((val) => {
    totalDeals = totalDeals + val.dealId.quantity;
    deal.push({
      dealId: val.dealId._id,
      quantity: val.dealId.quantity,
      finalPrice: val.dealId.finalprice,
    });
  });
  const billDetails = {
    total: totalAmount,
    tax: (totalAmount / 100) * 110 - totalAmount,
    amountPayable: totalAmount + ((totalAmount / 100) * 110 - totalAmount),
  };
  const Id = shortid.generate();
  const hash = "#";
  const purchaseId = hash + Id;
  const order = [];
  const purchase = [];
  var currentdate = new Date();

  const date = moment(currentdate).format("YYYY-MM-DD");
  const val = new Date();
  const time = moment(val).format("hh:mm:ss");

  order.push({
    userId: userId,
    storeId: storeId.dealId.storeId,
    orderDate: date,
    orderTime: time,
    deals: deal,
    PurchasedId: purchaseId,
    paymentId: paymentId,
    billDetails: billDetails,
  });
  purchase.push({
    storeId: storeId.dealId.storeId,
    orderDate: date,
    orderTime: time,
    deals: deal,
    PurchasedId: purchaseId,
    paymentId: paymentId,
    billDetails: billDetails,
  });
  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { dealPurchases: purchase } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: store.vendor },
    { $push: { orders: order } },
    { new: true }
  );
  await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: { addCard: [] } }
  );

  await Promise.all(
    dealed.addCard.map(async (ele) => {
      const notification = await Notification.create({
        message: "" + user.name + " order a deal",
        userId: user._id,
        type: "createOrder",
        deal: ele.dealId._id,
        quantity: ele.dealId.quantity,
      });
      await User.findOneAndUpdate(
        { _id: store.vendor },
        {
          $push: {
            notifications: {
              $each: [{ notificationId: notification._id }],
              $position: 0,
            },
          },
        }
      );
      // await notificationServices.orderNotification(
      //   store.vendor,
      //   notification.message,
      //   notification.userId,
      //   notification.deal,
      //   notification.quantity
      // );
    })
  );

  const count = totalDeals + store.totalDeals;
  const revenue = store.totalRevenue + billDetails.amountPayable;
  console.log(count,revenue)
  const data = await Store.findOneAndUpdate(
    { _id: storeId },
    {
      totalDeals: count,
      totalRevenue: revenue,
      purchasedCount: store.purchasedCount + 1,
    },
    { new: true }
  );
  console.log(data)
  return order;
};
const favoriteStore = async (userId, lat, long, page, limit) => {
  console.log(lat, long);
  const store = await User.findOne({ _id: userId })
    .populate({
      path: "favouriteStores",
      select: [
        "storeImage",
        "businessName",
        "storeType",
        "service",
        "loc",
        "description",
        "phoneNumber",
        "countryCode",
        "rating",
      ],
    })
    .lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }

  const longtitude = store.favouriteStores.map((val) => {
    return val.loc.coordinates.find((val, index) => val);
  });

  const latatitude = store.favouriteStores.map((val) => {
    return val.loc.coordinates.find((val, index) => {
      if (index == 1) {
        return val;
      }
    });
  });
  const lon1 = longtitude.find((val) => val);
  const lat1 = latatitude.find((val) => val);

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
  console.log(distance);

  store.favouriteStores.forEach((val) => {
    val.distance = distance.toFixed(1);
  });
  const lim = page + 1;

  const skip = page * limit;

  const order = store.favouriteStores.filter((value, index) => {
    if (index >= skip && index < limit * lim) {
      return value;
    }
  });

  return order;
};
const rating = async (userId, purchaseId, storeId, rating) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false }).lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const rate = await Store.findOneAndUpdate(
    { _id: storeId, isDeleted: false },
    { $push: { userRating: { userId: userId, rating: rating } } },
    { new: true }
  );
  const user = await User.updateOne(
    { _id: userId, "dealPurchases._id": purchaseId },
    {
      $set: {
        "dealPurchases.$.rating": rating,
        "dealPurchases.$.isRating": true,
      },
    },
    { new: true }
  );
  let count = 0;

  if (rate.userRating) {
    const value = rate.userRating.map((val) => {
      count = count + val.rating;
    });

    const finalRating = count / rate.userRating.length;
    await Store.findOneAndUpdate(
      { _id: storeId, isDeleted: false },
      { rating: finalRating }
    );
  }
};
const mapSearch = async (lat, long, search, filter, userId) => {
  if(search && filter){
    const store = await Store.find({
      "service.category": { $nin: "Cannabis" },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 100000,
        },
      },
      $or: [
        { storeType: { $regex: new RegExp(search, "i") } },
        { type: { $regex: new RegExp(search, "i") } },
        { businessName: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .lean();
    const storeData = formatStore(store);
    const data = [];
    storeData.map((val) => {
      console.log(JSON.stringify(filter).includes(val.service.categoryId))
      if(JSON.stringify(filter).includes(val.service.categoryId)){
           data.push(val)
      }
    });
    data.forEach((val)=>{
      const lon1 = val.loc.coordinates.find((val, index) => val);
      const lat1 =  val.loc.coordinates.find((val, index) => {
        if (index == 1) {
          return val;
        }})
     
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
  console.log(distance);
  val.distance = distance.toFixed(1),
  val.address=val.loc.address,
  val.coordinates=val.loc.coordinates
  delete val.loc
    })
   
    return data;
  }
  if (search) {
    const store = await Store.find({
      "service.category": { $nin: "Cannabis" },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 100000,
        },
      },
      $or: [
        { storeType: { $regex: new RegExp(search, "i") } },
        { type: { $regex: new RegExp(search, "i") } },
        { businessName: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .lean();
    const storeData = formatStore(store);
    storeData.forEach((val)=>{
      const lon1 = val.loc.coordinates.find((val, index) => val);
      const lat1 =  val.loc.coordinates.find((val, index) => {
        if (index == 1) {
          return val;
        }})
      
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
  console.log(distance);
  val.distance = distance.toFixed(1),
  val.address=val.loc.address,
  val.coordinates=val.loc.coordinates
  delete val.loc
    })
    return storeData;
  }
  if (filter) {
    console.log(filter);
    const store = await Store.find({
      "service.category": { $nin: "Cannabis" },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 100000,
        },
      },
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .lean();
    const storeData = formatStore(store);
    const data = [];
    storeData.map((val) => {
      console.log(JSON.stringify(filter).includes(val.service.categoryId))
      if(JSON.stringify(filter).includes(val.service.categoryId)){
           data.push(val)
      }
    });
    data.forEach((val)=>{
      const lon1 = val.loc.coordinates.find((val, index) => val);
      const lat1 =  val.loc.coordinates.find((val, index) => {
        if (index == 1) {
          return val;
        }})
      
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
  console.log(distance);
  val.distance = distance.toFixed(1),
  val.address=val.loc.address,
  val.coordinates=val.loc.coordinates
  delete val.loc
    })
    
    return data;
  }

  const store = await Store.find({
    "service.category": { $nin: "Cannabis" },
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [long, lat],
        },
        $maxDistance: 100000,
      },
    },
    isDeleted: false,
  })
    .sort({ _id: -1 })
    .lean();
  const storeData = formatStore(store);
  storeData.forEach((val)=>{
    const lon1 = val.loc.coordinates.find((val, index) => val);
    const lat1 =  val.loc.coordinates.find((val, index) => {
      if (index == 1) {
        return val;
      }})
 
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
console.log(distance);
val.distance = distance.toFixed(1),
val.address=val.loc.address,
val.coordinates=val.loc.coordinates
delete val.loc
  })
  return storeData;
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
  checkOut,
  favoriteStore,
  rating,
  cannabisCategoryData,
  payment,
  mapSearch,
};

// return;
