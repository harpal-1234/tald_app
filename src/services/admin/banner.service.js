const { Admin, Token, Banner } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const bannerRequest = async (req, res) => {
  const bannerRequest = await Banner.find({
    status: "pending",
    isDeleted: false,
  });
  return bannerRequest;
};

const bannerAction = async (req, res) => {
  const bannerRequest = await Banner.findOneAndUpdate(
    { $and: [{ _id: req.body.id }, { status: "pending" }] },
    { status: req.body.status },
    { new: true }
  );
  return bannerRequest;
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
const getAllBanners= async(page, limit, search, startDate, endDate)=>{
  const skip = page * limit ;
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
      // storeId: store._id,
      expireStatus: "activate",
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
     
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();

    let total = await Banner.countDocuments({
      // storeId: store._id,
      // expireStatus: "deactivate",
      isDeleted: false,
    });

    return { total, bannerData };
  }

}

module.exports = {
  bannerAction,
  bannerRequest,
  deleteBanner,
  getAllBanners
};
