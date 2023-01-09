const { Vendor, Deal, Token, User, Store } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment = require("moment");

const createDeal = async (data, tokendata) => {
 
  const vendor = await Store.findOne({ _id: tokendata, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  const deal = await Deal.findOne({
    dealId: data.dealId,
    isDeleted: false,
  });



  if (deal) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DEAL_ID
    );
  }
  const validFromDate=moment(data.validFrom).format("YYYY-MM-DD");
  const validToDate=moment(data.validTo).format("YYYY-MM-DD");

  const newDeal = await Deal.create({
    storeId:vendor.id,
    dealId: data.dealId,
    title:data.title,
    totalPrice: data.totalPrice,
    discountPrice:data.discountPrice,
    description: data.description,
    inclusions:data.inclusions,
    no_of_person: data.no_of_person,
    dealDate:data.dealDate,
    service:vendor.service,
    quantity:data.quantity,
    description: data.description,
    validFrom: moment(validFromDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    validTo: moment(validToDate+ "Z", "YYYY-MM-DD" + "Z").toDate(),
  });


  return newDeal;
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

    var dealData = await Deal.find({storeId:req.token.vendor._id, isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();
     

    let total = await Deal.countDocuments({storeId:req.token.vendor._id, isDeleted: false });

    return { total, dealData };
  }
};

// const getAllDeal=async(data)=>{

// }

const deleteDeal = async (data) => {
  const user = await Deal.findOne({ _id: data.id, isDeleted: false });
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

const editDeal=async(data,storeId)=>{
  console.log(storeId)
  const vendor = await Store.findOne({ _id: storeId, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const validFromDate=moment(data.validFrom).format("YYYY-MM-DD");
  const validToDate=moment(data.validTo).format("YYYY-MM-DD");
  
  
  const editDeal = await Deal.findOneAndUpdate({_id: data.id, storeId:vendor.id,},{
    dealId: data.dealId,
    title:data.title,
    totalPrice: data.totalPrice,
    discountPrice:data.discountPrice,
    description: data.description,
    inclusions:data.inclusions,
    no_of_person: data.no_of_person,
    dealDate:data.dealDate,
    service:vendor.service,
    quantity:data.quantity,
    description: data.description,
    validFrom: moment(validFromDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    validTo: moment(validToDate+ "Z", "YYYY-MM-DD" + "Z").toDate(),
  },{upsert:false,new:true});

 

  return editDeal;

}

module.exports = {
  createDeal,
  getAllDeal,
  deleteDeal,
  editDeal,
 
};
