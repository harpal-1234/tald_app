const { Admin, Banner } = require("../../models");
const {
  DELETE_MASSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const createBanner = async (data) => {
  const banner = await Banner.findOne({
    webLink: data.webLink,
    isDeleted: false,
  });
  if (banner) {
    throw OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.COUPON_WEBLINK
    );
  }
  const newBanner = await Banner.create(data);
  return newBanner;
};

const editBanner = async (data) => {
  const banner = await Banner.findOne({ _id: data.id, isDeleted: false });
  if (!banner) {
    throw OperationalError(
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

const getBanner = async (data) => {
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
    });

   

    return { total, bannerData };
  } else {
    // const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();
 
    // await Coupon.updateMany(
    //       { $and:[{ validTo: { $lte: date }} ,{isDeleted:false}]},
    //       { $set:{status: "deactivate", isActive:false} },
    //       { upsert:false }
    //     );
    
    var bannerData = await Banner.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .lean();


    let total = await Banner.countDocuments({ isDeleted: false });
   
   
    

    return { total, bannerData };
  }
};

module.exports = {
  createBanner,
  editBanner,
  deleteBanner,
  getBanner
};
