const { Admin, Token, Banner } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment = require("moment");
const {formatBanner1}= require("./../../utils/commonFunction")
const bannerRequest = async (req, res) => {
  const bannerRequest = await Banner.find({
    status: "pending",
    isDeleted: false,
  });
  return bannerRequest;
};

const bannerAction = async (bannerId) => {
  const check = await Banner.findOne({ _id: bannerId, isDeleted: false });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.BANNER_NOT_EXISTS
    );
  }
  if (check.status == "activate") {
    const bannerRequest = await Banner.findOneAndUpdate(
      {_id:bannerId},
      { status: "deactivate" ,expireStatus:"deactivate"},
      { new: true }
    );
    return "deactivate";
  }
  if (check.status == "deactivate") {
    const bannerRequest = await Banner.findOneAndUpdate(
      {_id:bannerId},
      { status: "activate" ,expireStatus:"activate"},
      { new: true }
    );
    return "activate";
  }
};

const deleteBanner = async (req, res) => {
  const banner = await Banner.findOne({ _id: req.query.id, isDeleted: false });
  if (!banner) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.BANNER_NOT_EXISTS
    );
  }
  const deleteBanner = await Banner.findOneAndUpdate(
    { _id: banner.id },
    {
      isDeleted: true,
    },
    { new: true, upsert: false }
  );
  return deleteBanner;
};
const getAllBanners = async (page, limit, search, startDate, endDate) => {
  const skip = page * limit;
  if (search) {
    // const store = await Store.findOne({ vendor: vendorId });
    // if (!store) {
    //   throw new OperationalError(
    //     STATUS_CODES.ACTION_FAILED,
    //     ERROR_MESSAGES.COUPON_DATA
    //   );
    // }
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      $or: [
        { bannerId: { $regex: new RegExp(search, "i") } },
        { title: { $regex: new RegExp(search, "i") } },
        { type: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      $or: [
      { bannerId: { $regex: new RegExp(search, "i") } },
      { title: { $regex: new RegExp(search, "i") } },
      { type: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });

    return { total, bannerData };
  }

  if (startDate && endDate) {
    // const store = await Store.findOne({ vendor: vendorId });
    // if (!store) {
    //   throw new OperationalError(
    //     STATUS_CODES.ACTION_FAILED,
    //     ERROR_MESSAGES.COUPON_DATA
    //   );
    // }
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      isDeleted: false,
    });

    return { total, bannerData };
  } else {
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      isDeleted: false,
    });

    return { total, bannerData };
  }
};
const payment = async (page, limit, search, startDate, endDate) => {
  const skip = page * limit;
  if (search) {
    
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      $or: [
        { voucherId: { $regex: new RegExp(search, "i") } },
        { plan: { $regex: new RegExp(search, "i") } },
        { type: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean().populate({
        path:"storeId",
        select:["vendor"],
        populate:{
          path:"vendor",
          select:"name"
        }
      });

    let total = await Banner.countDocuments({
      $or: [
        { voucherId: { $regex: new RegExp(search, "i") } },
        { plan: { $regex: new RegExp(search, "i") } },
        { type: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });
    const payment = formatBanner1(bannerData);
    return { total, payment };
  }

  if (startDate && endDate) {
    // const store = await Store.findOne({ vendor: vendorId });
    // if (!store) {
    //   throw new OperationalError(
    //     STATUS_CODES.ACTION_FAILED,
    //     ERROR_MESSAGES.COUPON_DATA
    //   );
    // }
    const dateObject = new Date(startDate);
    const startdate = dateObject.toISOString();

    const dateObject1 = new Date(endDate);
    const enddate = dateObject1.toISOString();
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      createdAt: { $gte: startdate, $lte: enddate },
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean().populate({
        path:"storeId",
        select:["vendor"],
        populate:{
          path:"vendor",
          select:"name"
        }
      });;

    let total = await Banner.countDocuments({
      createdAt: { $gte: startdate, $lte: enddate },
      isDeleted: false,
    });
    const payment = formatBanner1(bannerData);
    return { total, payment };
  } else {
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Banner.updateMany(
      { $and: [{ endDate: { $lte: date } }, { isDeleted: false }] },
      { $set: { expireStatus: "deactivate", isActive: false } },
      { upsert: false }
    );

    var bannerData = await Banner.find({
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean().populate({
        path:"storeId",
        select:["vendor"],
        populate:{
          path:"vendor",
          select:"name"
        }
      });;

    let total = await Banner.countDocuments({
      isDeleted: false,
    });
    const payment = formatBanner1(bannerData);
    return { total, payment };
  }
};
module.exports = {
  bannerAction,
  bannerRequest,
  deleteBanner,
  getAllBanners,
  payment
};
