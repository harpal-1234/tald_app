const { Vendor, Deal, Token, User, Store } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment = require("moment");

const createDeal = async (data, tokendata) => {
  const vendor = await Vendor.findOne({ _id: tokendata, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  const coupon = await Deal.findOne({
    couponCode: data.couponCode,
    isDeleted: false,
  });
  if (coupon) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.COUPON_CODE
    );
  }

  const newCoupon = await Deal.create({
    vendorId: vendor.id,
    couponCode: data.couponCode,
    category: data.category,
    storeId:data.storeId,
    name: data.name,
    worth: data.worth,
    description: data.description,
    validFrom: moment(data.validFrom + "Z", "YYYY-MM-DD" + "Z").toDate(),
    validTo: moment(data.validTo + "Z", "YYYY-MM-DD" + "Z").toDate(),
  });



  return newCoupon;
};

const getAllDeal = async (req, res) => {
  let { page, limit, search } = req.query;
  let skip = page * limit;
  if (search) {
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Deal.updateMany(
      { $and: [{ validTo: { $lte: date } }, { isDeleted: false }] },
      { $set: { status: "deactivate", isActive: false } },
      { upsert: false }
    );
    let dealData = await Deal.find({
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Deal.countDocuments({
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });

    return { total, dealData };
  } else {
    const date = moment("Z", "YYYY-MM-DD" + "Z").toISOString();

    await Deal.updateMany(
      { $and: [{ validTo: { $lte: date } }, { isDeleted: false }] },
      { $set: { status: "deactivate", isActive: false } },
      { upsert: false }
    );

    var dealData = await Deal.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();
     

    let total = await Deal.countDocuments({ isDeleted: false });

    return { total, dealData };
  }
};

const deleteDeal = async (data, tokendata) => {
  const user = await Vendor.findOne({ _id: tokendata, isDeleted: false });
  if (!user) {
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

  return deal;
};

const editDeal=async(bodyData,res)=>{
  const deal = await Deal.findOne({ _id: bodyData.id, vendorId:bodyData.vendorId,isDeleted: false });
  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const validFromDate=moment(bodyData.validFrom).format("YYYY-MM-DD");
  const validToDate=moment(bodyData.validTo).format("YYYY-MM-DD");
  
  
  const editDeal = await Deal.findOneAndUpdate({_id: bodyData.id},{
    vendorId: bodyData.vendorId,
    couponCode: bodyData.couponCode,
    category: bodyData.category,
    storeId:bodyData.storeId,
    name: bodyData.name,
    worth: bodyData.worth,
    description: bodyData.description,
    validFrom: moment(validFromDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    validTo: moment(validToDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
  },{upsert:false,new:true});

 console.log(editDeal)

  return editDeal;

}

module.exports = {
  createDeal,
  getAllDeal,
  deleteDeal,
  editDeal
};
