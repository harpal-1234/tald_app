const { User, Store, Vendor, Token, Category } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const { findOne } = require("../../models/token.model");
const moment=require("moment");
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
      startDate:moment(data.startDate  + "Z", "YYYY-MM-DD" + "Z").toDate(),
      endDate:moment(data.endDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
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
    businessName: data.businessName,
    storeType:data.storeType,
    email:data.email,
    description:data.description,
    countryCode:data.countryCode,
    phoneNumber:data.phoneNumber,
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
  const vendor = await Store.findOne({ _id: tokenData, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const updateStore = await Store.findOneAndUpdate(
    { _id: vendor.id },
    { $set:{
      category:data.category,
      storeType:data.storeType,
      description:data.description,
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
    }
    },
    { upsert: false,new:true }
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

// const getCategoryData = async (req, res) => {
//   const getAllCategory = await Store.find();
// };

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

const getStoreDetails=async(storeId)=>{
  const store = await Store.find({
    _id: storeId,
    isDeleted: false,
  }).lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  return store;


}

const getStoreCategory=async(req,res)=>{
  const data=await Category.find({ isDeleted: false }).lean()
  return data;

}

module.exports = {
  getStoreDetails,
  createStore,
  editStoreDetails,
  deleteStore,
  vendorStoreName,
  getStoreCategory
};
