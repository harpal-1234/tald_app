const successMessage = (code, data) => {
  return { statusCode: code, message: "success", data };
};

const successMessageWithoutData = (code, message) => {
  return { statusCode: code, message: message };
};
const formatUser = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.password;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.location;
      delete data.dealId;
      delete data.isPushNotification;
      delete data.isVerified;
      delete data.socialId;
      delete userData.dealPurchaseId;
      delete userData.favouriteStore;
      delete userData.favouriteStores
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
    delete userData.isPushNotification;
    delete userData.isVerified;
    delete userData.socialId;
    delete userData.dealPurchaseId;
    delete userData.favouriteStore;
    delete userData.favouriteStores
  }
  return userData;
};

const formatFavourites = (userData) => {
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

const formatDeal = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
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
const formatBanner = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
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

const formatResturant = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
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

const formatNotification = (userData) => {
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

const formatVendor = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
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
    delete data.password;
  }
  return userData;
};

const formatPurchase = (userData) => {
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
  delete userData.location;
  delete userData.dealId;
  delete userData.isPushNotification;
  delete userData.isVerified;
  delete userData.phoneNumber;
  delete userData.socialId;
  delete userData.favouriteStore;
  if (userData.dealPurchaseId.length) {
    userData.dealPurchaseId.forEach((data) => {
      delete data.__v;
      delete data.password;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.location;
      delete data.dealId;
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

const formatStoreDeal = (userData) => {
  delete userData.__v;
  delete userData.password;
  delete userData.vendorId;
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
  if (userData.deals.length) {
    userData.deals.forEach((data) => {
      delete data.__v;
      delete data.storeId;
      delete data.vendorId;
      delete data.password;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.location;
      delete data.dealId;
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

const formatCategory = (userData) => {
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
    delete data.password;
  }
  return userData;
};

const formatStore = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.isBlocked;
      delete data.isDeleted;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.customerId;
      delete data.password;
      delete data.dealId;
      delete data.deals;
      delete data.vendorId;
      delete data.location.loc.coordinates;
      delete data.location.loc.type;
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
    delete userData.password;
  }
  return userData;
};

module.exports = {
  successMessageWithoutData,
  successMessage,
  formatDeal,
  formatBanner,
  formatResturant,
  formatVendor,
  formatUser,
  formatFavourites,
  formatNotification,
  formatPurchase,
  formatStoreDeal,
  formatCategory,
  formatStore,
};
