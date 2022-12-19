const { Admin, Token, Store, Vendor } = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UPDATED_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const editStoreDetails = async (data) => {
  const store = await Vendor.findOne({ _id: data.vendorId, isDeleted: false });
  console.log(store);
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  console.log(data);

  const updateStore = await Store.findOneAndUpdate(
    { _id: data.id },
    {
      storeName: data.storeName,
      vendorId:data.vendorId,
      service: data.service,
      location: {
        loc: {
          address: data.address,
          coordinates: [data.long, data.lat],
        },
      },
    },
    { upsert: false ,new:true}
  );
  return updateStore;
};

const getAllStore = async (req, res) => {
  const store = await Store.find({ isDeleted: false }).lean();
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }

  return store;
};

const getStoreDeals = async (storeId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });

  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }

  const storeData = await Store.findOne({ _id: store.id, isDeleted: false })
    .populate({ path: "deals" })
    .lean();

  return storeData;
};

const deleteStore = async (storeId) => {
  const store = await Store.findOne({ _id: storeId, isDeleted: false });

  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }

  const storeData = await Store.findOneAndUpdate(
    { _id: store.id },
    {
      isDeleted: true,
    },
    { upsert: false }
  );

  return;
};

module.exports = {
  getAllStore,
  getStoreDeals,
  deleteStore,
  editStoreDetails,
};
