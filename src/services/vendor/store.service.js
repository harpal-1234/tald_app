const { User, Store, Vendor, Token, Category, Deal } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const { findOne } = require("../../models/token.model");
const moment = require("moment");
const { Console } = require("winston/lib/winston/transports");
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
      loc: {
        address: data.address,
        coordinates: [data.long, data.lat],
      },
    });
     
    const val = await User.findOneAndUpdate({_id:vendorId,isDeleted:false},{isVerifyStore:true},{new:true})
     store.isVerifyStore = val.isVerifyStore
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
  console.log(vendorId);
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
const dashboard = async (vendorId, page, limit) => {
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
  const [deals, store] = await Promise.all([
    Deal.countDocuments({ vendor: vendorId }),
    Store.findOne({ vendor: vendorId })
      .populate({
        path: "vendor",
        populate: [
          {
            path: "orders.userId",
            select: ["image", "name"],
          },
          {
            path: "orders.deals.dealId",
            select: ["totalPrice", "discountPrice","title","no_of_person"],
          },
        ],
      })
      .lean(),
  ]);

  store.vendor.orders.forEach((val) => {
    val.deals.forEach((ele) => {
      ele.dealId.finalPrice = ele.dealId.discountPrice;
    });
  });
  const orders = store.vendor.orders
    .slice(0)
    .reverse()
    .map((val) => {
      return val;
    });
  // const lim = page + 1;

  // const skip = page * limit;

  const order = orders.filter((value, index) => {
    if (index >= 0 && index < 9) {
      return value;
    }
  });

  const value = {
      totalDeals: deals,
      totalDealsPurchased: store.totalDeals,
      totalRevenue:store.totalRevenue,
      orders:order

    }
    

  return value
};
const vendorOrder = async (
  vendorId,
  search,
  page,
  limit,
  startDate,
  endDate
) => {
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
  const [store] = await Promise.all([
    Store.findOne({ vendor: vendorId })
      .populate({
        path: "vendor",
        populate: [
          {
            path: "orders.userId",
            select: ["image", "name"],
          },
          {
            path: "orders.deals.dealId",
            select: ["totalPrice", "discountPrice"],
          },
        ],
      })
      .lean(),
  ]);

  store.vendor.orders.forEach((val) => {
    val.deals.forEach((ele) => {
      ele.dealId.finalPrice =  ele.dealId.discountPrice;
    });
  });
  const orders = store.vendor.orders
    .slice(0)
    .reverse()
    .map((val) => {
      return val;
    });
  console.log(!search && !startDate);

  if (!search && !startDate && !endDate) {
    const lim = page + 1;

    const skip = page * limit;

    const order = orders.filter((value, index) => {
      if (index >= skip && index < limit * lim) {
        return value;
      }
    });
    const data = {
      totalOrder: orders.length,
      totalRevenue:store.totalRevenue,
      orders:order

    }
    
    return data;
  }

  else if ((search && startDate && endDate)) {
    const lim = page + 1;

    const skip = page * limit;
    const order = orders.filter(
      (val) =>
        JSON.stringify(val.userId.name.toLowerCase()).includes(
          search.toLowerCase()
        ) ||
        JSON.stringify(val.PurchasedId.toLowerCase()).includes(
          search.toLowerCase()
        )
    );
    const sDate = moment(startDate);
    const eDate = moment(endDate);

    const data1= order.filter((val) => {
      if (sDate >= moment(val.orderDate) && eDate <= moment(val.orderDate)) {
        return val;
      }
    });
    const value = data1.filter((value, index) => {
      if (index >= skip && index < limit * lim) {
        return value;
      }
    });
    const data = {
      totalOrder: data1.length,
      totalRevenue:store.totalRevenue,
      orders:order

    }
    

    return data;
  }
   else if (search) {
    const lim = page + 1;

    const skip = page * limit;
    const order = orders.filter(
      (val) =>
        JSON.stringify(val.userId.name.toLowerCase()).includes(
          search.toLowerCase()
        ) ||
        JSON.stringify(val.PurchasedId.toLowerCase()).includes(
          search.toLowerCase()
        )
    );
    const value = orders.filter((value, index) => {
      if (index >= skip && index < limit * lim) {
        return value;
      }
    });

    const data = {
      totalOrder: orders.length,
      totalRevenue:store.totalRevenue,
      orders:order

    }
    

    return data;
  }
  else if(startDate && endDate){
    const lim = page + 1;

    const skip = page * limit;
    const sDate = moment(startDate);
    const eDate = moment(endDate);

    const data1= orders.filter((val) => {
      if (sDate >= moment(val.orderDate) && eDate <= moment(val.orderDate)) {
        return val;
      }
    });
    const value = data1.filter((value, index) => {
      if (index >= skip && index < limit * lim) {
        return value;
      }
    });
    const data = {
      totalOrder: data1.length,
      totalRevenue:store.totalRevenue,
      orders:order

    }
    

    return data;
  }
};

module.exports = {
  getStoreDetails,
  createStore,
  editStoreDetails,
  deleteStore,
  vendorStoreName,
  getStoreCategory,
  dashboard,
  vendorOrder,
};
