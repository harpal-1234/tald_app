const { Vendor, Banner, Store } = require("../../models");
const {
  DELETE_MASSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment = require("moment");
const { findOneAndUpdate } = require("../../models/token.model");

const createBanner = async (data, vendorId) => {
  const vendor = await Banner.findOne({
    bannerId: data.bannerId,
    isDeleted: false,
  });

  if (vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.BANNER_ID
    );
  }
  const store = await Store.findOne({ vendor: vendorId, isDeleted: false });

  const startDate = moment(data.startDate).format("YYYY-MM-DD");
  const endDate = moment(data.endDate).format("YYYY-MM-DD");

  const newBanner = await Banner.create({
    storeId: store._id,
    image: data.image,
    service: store.service,
    title: data.title,
    bannerId: data.bannerId,
    type: data.type,
    startDate: moment(startDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    endDate: moment(endDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
  });

  return newBanner;
};

const bannerAction = async (data, vendorId) => {
  const store = await Store.findOne({ vendor: vendorId, isDeleted: false });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  // const banner = await Banner.findByIdAndUpdate({
  //   _id: data.id,
  //   status: data.status,
  //   isDeleted: false,
  // });
  let ban = await Banner.findById(data.id).lean();
  if(ban.status == "activate"){
    const banner = await Banner.findOneAndUpdate({
      _id:data.id
    },{
     status:"deactivate" 
    },{
      new:true
    })
    return "deactivate"
  }else{
    const banner = await Banner.findOneAndUpdate({
      _id:data.id
    },{
     status:"activate" 
    },{
      new:true
    })
    return "activate"

  }
  // const banner = await Banner.updateOne(
  //   { _id: data.id },

  //   {
  //     $set: {
  //       status: {
  //         $cond: {
  //           if: { $eq: ["$status", "activate"] },
  //           then: "deactivate",
  //           else: "activate",
  //         },
  //       },
  //     },
  //   },
  //   { new: true }
  // );

  return banner;
};

const editBanner = async (data) => {
  const banner = await Banner.findOne({ _id: data.id, isDeleted: false });
  if (!banner) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.COUPON_DATA
    );
  }
  const bannerData = await Banner.findOneAndUpdate(
    { _id: data.id },
    {
      $set: {
        image: data.title,
        title: data.title,
        description: data.description,
        webLink: data.description,
      },
    },
    { new: true }
  );
  return bannerData;
};

const deleteBanner = async (data) => {
  const banner = await Banner.findOne({ _id: data.id, isDeleted: false });
  if (!banner) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.COUPON_DATA
    );
  }
  const bannerData = await Banner.findOneAndUpdate(
    { _id: data.id },
    {
      isDeleted: true,
    },
    { new: true }
  );
  return bannerData;
};

const getBanner = async (data, vendorId) => {
  let { page, limit, search } = data;
  let skip = page * limit;

  // if (search) {
  //   // const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

  //   // await Coupon.updateMany(
  //   //       { $and:[{ validTo: { $lte: date }} ,{isDeleted:false}]},
  //   //       { $set:{status: "deactivate", isActive:false} },
  //   //       { upsert:false }
  //   //     );
  //   let bannerData = await Banner.find({
  //     $or: [
  //       { couponCode: { $regex: new RegExp(search, "i") } },
  //       { name: { $regex: new RegExp(search, "i") } },
  //       //   { lastName: { $regex: new RegExp(search,"i") }, },
  //       //   { fullName: { $regex: new RegExp(search,"i") }, },
  //     ],
  //     isDeleted: false,
  //     status: "accepted",
  //   })
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ _id: 1 })
  //     .lean();

  //   let total = await Banner.countDocuments({
  //     $or: [
  //       { couponCode: { $regex: new RegExp(search, "i") } },
  //       { name: { $regex: new RegExp(search, "i") } },
  //     ],
  //     isDeleted: false,

  //   });

  //   return { total, bannerData };
  // } else {
  // const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

  // await Coupon.updateMany(
  //       { $and:[{ validTo: { $lte: date }} ,{isDeleted:false}]},
  //       { $set:{status: "deactivate", isActive:false} },
  //       { upsert:false }
  //     );
  if (data.type == "active") {
    const store = await Store.findOne({ vendor: vendorId });
    if (!store) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.COUPON_DATA
      );
    }
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      storeId: store._id,
      expireStatus: "activate",
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      storeId: store._id,
      expireStatus: "activate",
      isDeleted: false,
    });

    return { total, bannerData };
  }

  if (data.type == "deactive") {
    const store = await Store.findOne({ vendor: vendorId });
    if (!store) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.COUPON_DATA
      );
    }
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      storeId: store._id,
      expireStatus: "deactivate",
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      storeId: store._id,
      expireStatus: "deactivate",
      isDeleted: false,
    });

    return { total, bannerData };
  }
};

module.exports = {
  createBanner,
  editBanner,
  deleteBanner,
  getBanner,
  bannerAction,
};
