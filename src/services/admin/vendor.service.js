const { Admin, Vendor } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const createVendor = async (data) => {
  const vendor = await Vendor.findOne({ email: data.email, isDeleted: false });
  if (vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const newAdmin = await Vendor.create({
    userName: data.userName,
    email: data.email,
    password:data.password,
    businessName: data.businessName,
    location: {
      loc: {
        address: data.address,
        type: "Point",
        coordinates: [data.long, data.lat],
      },
    },
    phoneNumber: data.phoneNumber,
    countryCode: data.countryCode,
  });

  return newAdmin;
};

const getAllVendor = async (req, res) => {
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
  const vendorData = await Vendor.findOne({
    _id: req.query.id,
    isDeleted: false,
  });

  if (!vendorData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const vendor = await Vendor.findOneAndUpdate(
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

module.exports = {
  createVendor,
  getAllVendor,
  deleteVendor,
  editVendorProfile,
};
