export const successMessage = (code, data) => {
  return { statusCode: code, message: "success", data };
};

export const successMessageWithoutData = (code, message) => {
  return { statusCode: code, message: message };
};
export const formatUser = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      // const count = await Deal.countDocuments({
      //   vendor: data._id,
      //   isActive: true,
      //   isDeleted: false,
      // }).lean();
      // data.activeDeals = 2;
      delete data.__v;
      delete data.password;
      //delete data.isBlocked;
      //delete data.isDeleted;
      // delete data.createdAt;
      // delete data.updatedAt;
      // delete data.customerId;
      // delete data.location;
      // delete data.dealId;
      // delete data.isPushNotification;
      // delete data.isVerified;
      // delete data.socialId;
      // delete data.dealPurchaseId;
      // delete data.favouriteStore;
      // delete data.favouriteStores;
      // delete data.recentlyView;
      // delete data.orders;
      // delete data.dealPurchases;
    });
  } else {
    delete userData.__v;
    delete userData.password;
    // delete userData.role;
    // delete userData.document;
    // delete userData.isBlocked;
    // delete userData.isDeleted;
    // delete userData.jobTitle;
    // delete userData.__v;
    // delete userData.password;
    // delete userData.location;
    // delete userData.isPushNotification;
    // delete userData.isVerified;
    // delete userData.socialId;
    // delete userData.dealPurchaseId;
    // delete userData.favouriteStore;
    // delete userData.favouriteStores;
    // delete userData.recentlyView;
    // delete userData.orders;
    // delete userData.dealPurchases;
  }
  return userData;
};

export const formatFavourites = (userData) => {
  delete userData.__v;
  delete userData.name;
  delete userData.email;
  delete userData._id;
  delete userData.password;
  delete userData.role;
  delete userData.document;
  delete userData.isBlocked;
  delete userData.isDeleted;
  delete userData.createdAt;
  delete userData.updatedAt;
  delete userData.jobTitle;
  delete userData.__v;
  delete userData.location;
  delete userData.isPushNotification;
  delete userData.isVerified;
  delete userData.phoneNumber;
  delete userData.dealPurchaseId;
  if (userData.favouriteStores.length) {
    userData.favouriteStores.forEach((data) => {
      delete data.__v;
      delete data.password;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.location;
      delete data.dealId;
      delete data.deals;
      delete data.phoneNumber;
      delete data.isPushNotification;
      delete data.isVerified;
      delete data.socialId;
    });
  } else {
    delete userData.__v;
    delete userData.password;
    delete userData.role;
    delete userData.document;
    delete userData.isBlocked;
    delete userData.isDeleted;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.jobTitle;
    delete userData.__v;
    delete userData.password;
    delete userData.location;
    delete userData.phoneNumber;
    delete userData.isPushNotification;
    delete userData.isVerified;
    delete userData.socialId;
  }
  return userData;
};
export const formatBanner1 = (userData) => {
  if (userData.length) {
    userData.forEach(async (data) => {
      delete data.__v;
      delete data.stores;
      delete data.startDate;
      delete data.endDate;
      data.name = data.storeId.vendor.name;
      delete data.storeId;
      // delete data.createdAt;
      // delete data.updatedAt;
      // delete data.customerId;
      // delete data.location;
      // delete data.dealId;
      // delete data.deals;
      // delete data.phoneNumber;
      // delete data.isPushNotification;
      // delete data.isVerified;
      // delete data.socialId;
    });
  } else {
    delete userData.__v;
    delete userData.password;
    delete userData.role;
    delete userData.document;
    delete userData.isBlocked;
    delete userData.isDeleted;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.jobTitle;
    delete userData.__v;
    delete userData.password;
    delete userData.location;
    delete userData.phoneNumber;
    delete userData.isPushNotification;
    delete userData.isVerified;
    delete userData.socialId;
  }
  return userData;
};

export const formatBanner = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.stores;
      delete data.webLink;
      delete data.type;
      delete data.title;
      delete data.vendor;
      delete data.service;
      delete data.isVerified;
    });
  } else {
    delete userData.__v;
    delete userData.isBlocked;
    delete userData.isDeleted;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.__v;
    delete userData._id;
    delete userData.vendorId;
  }
  return userData;
};
export const formatNotification = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.password;
      delete data.storeId;
      delete data.vendorId;
      delete data.dealId;
    });
  } else {
    delete userData.__v;
    delete userData.isBlocked;
    delete userData.isDeleted;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.__v;
    delete userData._id;
    delete userData.vendorId;
    delete data.password;
    delete data.storeId;
    delete data.dealId;
  }
  return userData;
};
export const formatCategory = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.password;
    });
  } else {
    delete userData.__v;
    delete userData.isBlocked;
    delete userData.isDeleted;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.__v;
    delete userData._id;
    delete userData.vendorId;
  }
  return userData;
};




