const { User, Store, Vendor, Token, Category } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const { findOne } = require("../../models/token.model");
// const genrateCatoryId=require("")

const createStore = async (data, vendorId) => {
  
  const category = await Category.findOne({
    _id: data.service.categoryId,
    category: data.service.category,
    isDeletd: false,
  });
  if (!category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_NOT_EXISTS
    );
  }
  if (data.service.category === "Cannabis") {
    const store = await Store.create({
      vendorId: vendorId,
      service: data.service,
      storeName: data.storeName,
      about: data.about,
      type: data.type,
      phoneNumber: data.phoneNumber,
      location: {
        loc: {
          address: data.address,
          coordinates: [data.long, data.lat],
        },
      },
    });

    return store;
  }

  const store = await Store.create({
    vendorId: vendorId,
    service: data.service,
    storeName: data.storeName,
    location: {
      loc: {
        address: data.address,
        coordinates: [data.long, data.lat],
      },
    },
  });

  return store;
};

const editStoreDetails = async (data, tokenData) => {
  const vendor = await Vendor.findOne({ _id: tokenData.id, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const updateStore = await Store.findOneAndUpdate(
    { _id: data.id },
    {
      storeName: data.storeName,
      service: data.service,
      location: {
        loc: {
          address: data.address,
          coordinates: [data.long, data.lat],
        },
      },
    },
    { upsert: false }
  );
  return updateStore;
};

const deleteStore = async (data, tokendata) => {
  const vendor = await Vendor.findOne({ _id: tokendata.id, isDeleted: false });
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

const getCategoryData = async (req, res) => {
  const getAllCategory = await Store.find();
};

const vendorStoreName = async (vendorId) => {
  const store = await Store.find({
    vendorId: vendorId,
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

module.exports = {
  createStore,
  editStoreDetails,
  deleteStore,
  vendorStoreName,
};
