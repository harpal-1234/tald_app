const { User, Store, Vendor, Token, Category, Deal } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const { findOne } = require("../../models/token.model");
const moment = require("moment");
// const genrateCatoryId=require("")

const createStore = async (data, vendorId) => {
  console.log(data.service.categoryId);

  const vendor = await User.findOne({
    _id: vendorId,
    type: "Vendor",
    isDeletd: false,
  });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.VENDOR_NOT_EXIST
    );
  }

  const category = await Category.findOne({
    _id: data.service.categoryId,
    isDeletd: false,
  });
  if (!category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_NOT_EXISTS
    );
  }

  if (JSON.stringify(category).includes(data.service.category)) {
    const store = await Store.create({
      service: data.service,
      storeName: data.storeName,
      storeImage: data.storeImage,
      email: data.email,
      storeType: data.storeType,
      businessName: data.businessName,
      description: data.description,
      countryCode: data.countryCode,
      type: data.type,
      // startDate: moment(data.startDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
      // endDate: moment(data.endDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
      phoneNumber: data.phoneNumber,
      vendor: vendorId,
      location: {
        loc: {
          address: data.address,
          coordinates: [data.long, data.lat],
        },
      },
    });

    return store;
  }
};

const editStoreDetails = async (data, vendorId) => {
  const vendor = await Store.findOne({ vendor: vendorId, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const updateStore = await Store.findOneAndUpdate(
    { _id: vendor._id },
    {
      service: data.service,
      storeName: data.storeName,
      storeImage: data.storeImage,
      email: data.email,
      storeType: data.storeType,
      businessName: data.businessName,
      description: data.description,
      countryCode: data.countryCode,
      type: data.type,
      // startDate: moment(data.startDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
      // endDate: moment(data.endDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
      phoneNumber: data.phoneNumber,
      vendor: vendorId,
      location: {
        address: data.address,
        loc: {
          type: "Point",
          coordinates: [data.long, data.lat],
        },
      },
  },

    { new: true }
  );
  return updateStore;
};

const deleteStore = async (data, vendorId) => {
  console.log(vendorId)
  const vendor = await Vendor.findOne({
    _id: vendorId,
    isDeleted: false,
  });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const store = await Store.findOneAndUpdate(
    { _id: data.id, vendorId: vendor.id },
    { isDeleted: true },
    { new: true }
  );
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return store;
};

// const getCategoryData = async (req, res) => {
//   const getAllCategory = await Store.find();
// };

const vendorStoreName = async (vendorId) => {
  const store = await Store.find({
    vendor: vendorId,
    isDeleted: false,
  }).lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  return store;
};

const getStoreDetails = async (vendorId) => {
  const store = await Store.find({
    vendor: vendorId,
    isDeleted: false,
  }).lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  return store;
};

const getStoreCategory = async (req, res) => {
  const data = await Category.find({ isDeleted: false }).lean();
  return data;
};
const dashboard = async (vendorId) => {
  const vendor = await User.findOne({
    _id: vendorId,
    type: "Vendor",
    isDeletd: false,
  });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.VENDOR_NOT_EXIST
    );
  }
  const deals = await Deal.countDocuments({ vendor: vendorId });
  console.log(deals);
};

module.exports = {
  getStoreDetails,
  createStore,
  editStoreDetails,
  deleteStore,
  vendorStoreName,
  getStoreCategory,
  dashboard,
};
