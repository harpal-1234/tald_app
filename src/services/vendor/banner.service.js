const { Vendor, Banner, Store } = require("../../models");
const {
  DELETE_MASSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment=require('moment');

const createBanner = async (data, tokenData) => {
  if (data.type === "Promoted") {
    const vendor = await Banner.findOne({ bannerId: data.bannerId, isDeleted: false });

    if (vendor) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.BANNER_ID
      );
    }
    const store=await Store.findOne({_id:tokenData,isDeleted:false});
   
    const startDate=moment(data.startDate).format("YYYY-MM-DD");
  const endDate=moment(data.endDate).format("YYYY-MM-DD");

    const newBanner = await Banner.create({
      storeId: store.id,
      image: data.image,
      service: store.service,
      title: data.title,
      bannerId: data.bannerId,
      type: data.type,
      startDate: moment(startDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    endDate: moment(endDate+ "Z", "YYYY-MM-DD" + "Z").toDate(),
    });

    return newBanner;
  } else if (data.type === "Category") {
  }
};

const bannerRequest = async (data, totkenData) => {
  const vendor = await Store.findOne({ _id: totkenData, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const banner = await Banner.findByIdAndUpdate({
    _id: data.id,
    status: data.status,
    isDeleted: false,
  });

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

const getBanner = async (data,storeId) => {
  let { page, limit, search } = data;
  let skip = page * limit;

  if (search) {
    // const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    // await Coupon.updateMany(
    //       { $and:[{ validTo: { $lte: date }} ,{isDeleted:false}]},
    //       { $set:{status: "deactivate", isActive:false} },
    //       { upsert:false }
    //     );
    let bannerData = await Banner.find({
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
        //   { lastName: { $regex: new RegExp(search,"i") }, },
        //   { fullName: { $regex: new RegExp(search,"i") }, },
      ],
      isDeleted: false,
      status: "accepted",
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
      status: "accepted",
    });

    return { total, bannerData };
  } else {
    // const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    // await Coupon.updateMany(
    //       { $and:[{ validTo: { $lte: date }} ,{isDeleted:false}]},
    //       { $set:{status: "deactivate", isActive:false} },
    //       { upsert:false }
    //     );

    var bannerData = await Banner.find({ storeId:storeId,isDeleted: false})
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      storeId:storeId,
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
  bannerRequest,
};
