const { Admin,Vendor} = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const createVendor=async(data,adminData) =>{
  
  const admin=await Admin.findOne({id:adminData,isDeleted:false});
  if (!admin) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const newAdmin= await Vendor.create(data);
  return newAdmin;

}

const getAllVendor=async(req,res) =>{
  let { page, limit, search } = req.query;
  let skip = page * limit;
  if (search) {
    let vednorData = await Vendor.find({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Vendor.countDocuments({
      $or: [
        { couponCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });

    return { total, vednorData };
  } else {

    var vendorData = await Vendor.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await Vendor.countDocuments({ isDeleted: false });

    return { total, vendorData };
  }
  


}

module.exports={
  createVendor,
  getAllVendor
}