const { Admin, Vendor, User, Deal } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const { formatUser } = require("../../utils/commonFunction");
const moment = require("moment");
// const createVendor = async (data) => {
//   const vendor = await Vendor.findOne({ email: data.email, isDeleted: false });
//   if (vendor) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }
//   const newAdmin = await Vendor.create({
//     userName: data.userName,
//     email: data.email,
//     password:data.password,
//     businessName: data.businessName,
//     location: {
//       loc: {
//         address: data.address,
//         type: "Point",
//         coordinates: [data.long, data.lat],
//       },
//     },
//     phoneNumber: data.phoneNumber,
//     countryCode: data.countryCode,
//   });

//   return newAdmin;
// };

const getAllVendor = async (page, limit, search, startDate, endDate) => {
  let skip = page * limit;
  if (startDate && endDate) {
    const dateObject = new Date(startDate);
    const startdate = dateObject.toISOString();

    const dateObject1 = new Date(endDate);
    const enddate = dateObject1.toISOString();

    const value = await User.find({
      isDeleted: false,
      type: "Vendor",
      createdAt: { $gte: startdate, $lte: enddate },
    })
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    let total = await User.countDocuments({
      isDeleted: false,
      type: "Vendor",
      createdAt: { $gte: startdate, $lte: enddate },
    }).lean();
    //console.log(value)
    const arr =[]
   await  Promise.all(value.map(async (val) => {
      const count = await Deal.countDocuments({
        vendor: val._id,
        isActive: true,
        isDeleted: false,
      }).lean();
      val.activeDeals = count;
      arr.push(val)
      //console.log(val)
    }));
    const Vendors = await formatUser(arr);

    return { Vendors, total };
    return { users, total };
  }
  if (search) {
    let value = await User.find({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      type: "Vendor",
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await User.countDocuments({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      type: "Vendor",
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();
      const arr =[]
      await  Promise.all(value.map(async (val) => {
         const count = await Deal.countDocuments({
           vendor: val._id,
           isActive: true,
           isDeleted: false,
         }).lean();
         val.activeDeals = count;
         arr.push(val)
         //console.log(val)
       }));
       const Vendors = await formatUser(arr);
    return { Vendors, total };
  } else {
    var value = await User.find({ type: "Vendor", isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await User.countDocuments({ isDeleted: false, type: "Vendor" });
    const arr =[]
    await  Promise.all(value.map(async (val) => {
       const count = await Deal.countDocuments({
         vendor: val._id,
         isActive: true,
         isDeleted: false,
       }).lean();
       val.activeDeals = count;
       arr.push(val)
       //console.log(val)
     }));
     const Vendors = await formatUser(arr);
    return { Vendors, total };
  }
};

const editVendorProfile = async (req, res) => {
  const vendorData = await Vendor.findOne({
    _id: req.body.id,
    isDeleted: false,
  });

  if (!vendorData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const valueData = await Vendor.findOne({ email: req.body.email });

  if (valueData) {
    if (vendorData.email !== valueData.email) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }
  }

  const vendor = await Vendor.findOneAndUpdate(
    { _id: req.body.id },
    {
      email: req.body.email,
      userName: req.body.userName,
    },
    {
      upsert: false,
    }
  );
  return;
};

const deleteVendor = async (req, res) => {
  const vendorData = await User.findOne({
    _id: req.query.id,
    isDeleted: false,
  });

  if (!vendorData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const vendor = await User.findOneAndUpdate(
    { _id: req.query.id },
    {
      isDeleted: true,
    },
    {
      upsert: false,
    }
  );
  return;
};
const blockVendor = async (req, res) => {
  const vendorData = await User.findOne({
    _id: req.query.id,
    isDeleted: false,
  });

  if (!vendorData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
if(vendorData.isBlocked ==false){
  const vendor = await User.findOneAndUpdate(
    { _id: req.query.id },
    {
      isBlocked: true,
    }
  );
  return "Vendor Blocked successfully"
}
if(vendorData.isBlocked ==true){
  const vendor = await User.findOneAndUpdate(
    { _id: req.query.id },
    {
      isBlocked: false,
    }
  );
  return "Vendor unBlocked successfully"
}
};
const vendorDeals = async (page, limit, search, type, vendorId) => {
  let skip = page * limit;
  if (search && type == "all") {
    const date1 = moment("Z", "YYYY-MM-DD" + "Z").toISOString();
    console.log(date1);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() - 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const date = tomorrow.toISOString();
    var deal = await Deal.findOne({
      vendor: vendorId,
      isDeleted: false,
    }).populate({
      path: "storeId",
      select: ["purchasedCount"],
    });
    if (!deal) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.DEAL_NOT_EXISTS
      );
    }
    const totalDealsPurchesed = deal.storeId.purchasedCount;
    await Deal.updateMany(
      { $and: [{ dealId: { $lte: date } }, { isDeleted: false }] },
      { $set: { status: "deactivate", isActive: false } },
      { upsert: false }
    );
    let dealData = await Deal.find({
      vendor: vendorId,
      $or: [
        { dealId: { $regex: new RegExp(search, "i") } },
        { title: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Deal.countDocuments({
      vendor: vendorId,
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });

    return { totalDealsPurchesed, total, dealData };
  }

  if (search && type == "active") {
    const date1 = moment("Z", "YYYY-MM-DD" + "Z").toISOString();
    console.log(date1);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() - 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const date = tomorrow.toISOString();
    var deal = await Deal.findOne({
      vendor: vendorId,
      isDeleted: false,
    }).populate({
      path: "storeId",
      select: ["purchasedCount"],
    });
    if (!deal) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.DEAL_NOT_EXISTS
      );
    }
    const totalDealsPurchesed = deal.storeId.purchasedCount;
    await Deal.updateMany(
      { $and: [{ validTo: { $lte: date } }, { isDeleted: false }] },
      { $set: { status: "deactivate", isActive: false } },
      { upsert: false }
    );

    var dealData = await Deal.find({
      vendor: vendorId,
      status: "activate",
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Deal.countDocuments({
      vendor: vendorId,
      status: "activate",
      isDeleted: false,
    });

    return { totalDealsPurchesed, total, dealData };
  } else {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() - 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const date = tomorrow.toISOString();

    var deal = await Deal.findOne({
      vendor: vendorId,
      isDeleted: false,
    }).populate({
      path: "storeId",
      select: ["purchasedCount"],
    });
    if (!deal) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.DEAL_NOT_EXISTS
      );
    }
    const totalDealsPurchesed = deal.storeId.purchasedCount;
    await Deal.updateMany(
      { $and: [{ validTo: { $lte: date } }, { isDeleted: false }] },
      { $set: { status: "deactivate", isActive: false } },
      { upsert: false }
    );

    var dealData = await Deal.find({
      vendor: vendorId,
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Deal.countDocuments({
      vendor: vendorId,
      isDeleted: false,
    });

    return { totalDealsPurchesed, total, dealData };
  }
};
const dealDelete = async(dealId)=>{
  const check = await Deal.findOne({ _id: dealId, isDeleted: false });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const deal = await Deal.findOneAndUpdate(
    { _id: data.id },
    { isDeleted: true },
    { new: true }
  );

  return deal
}
module.exports = {
  // createVendor,
  getAllVendor,
  deleteVendor,
  editVendorProfile,
  blockVendor,
  vendorDeals,
  dealDelete
};
