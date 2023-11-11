export const successMessage = (code, data) => {
  return { statusCode: code, message: "success", data };
};

export const successMessageWithoutData = (code, message) => {
  return { statusCode: code, message: message };
};
export const formatUser = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.password;
    });
  } else {
    delete userData.__v;
    delete userData.password;
  }
  return userData;
};
export const formatProjectInquery = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.designers;
    });
  } else {
    delete userData.designers;
  }
  return userData;
};
export const formatProjects = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.files,
        delete data.user,
        delete data.projectType,
        delete data.kindOfAssistance,
        delete data.projectSummary,
        delete data.address,
        delete data.location,
        delete data.startDate,
        delete data.endDate,
        delete data.projectFund,
        delete data.primaryDecisionMaker,
        delete data.workedWithInteriorDesigner,
        delete data.involvedYourProject,
        delete data.isDeleted,
        delete data.isVerify,
        delete data.isBlocked,
        delete data.isDeleted,
        delete data.designers,
        delete data.designer,
        delete data.status;
    });
  } else {
    delete userData.files,
      delete userData.user,
      delete userData.projectType,
      delete userData.kindOfAssistance,
      delete userData.projectSummary,
      delete userData.address,
      delete userData.location,
      delete userData.startDate,
      delete userData.endDate,
      delete userData.projectFund,
      delete userData.primaryDecisionMaker,
      delete userData.workedWithInteriorDesigner,
      delete userData.involvedYourProject,
      delete userData.isDeleted,
      delete userData.isVerify,
      delete userData.isBlocked,
      delete userData.isDeleted,
      delete userData.designers,
      delete userData.designer,
      delete userData.status;
  }
  return userData;
};
export const formatVendor = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.password;
      delete data.projectType;
      delete data.virtual_Consultations;
      delete data.newClientProjects;
      delete data.destinationProject;
      delete data.feeStructure;
      delete data.tradeDiscount;
      delete data.minBudget;
      delete data.maxBudget;
      delete data.weeklySchedule;
      delete data.availability;
      delete data.goals;
      delete data.preferences;
      delete data.projectSize;
      delete data.styles;
      delete data.isSignUp;
      delete data.isApproved;
      delete data.isIndefinitely;
      delete data.inviteesSchedule;
      delete data.saveProfiles;
      delete data.saveImages;
      delete data.subscription;
      delete data.stripe;
      delete data.needHelp;
    });
  } else {
    delete userData.__v;
    delete userData.password;
    delete userData.projectType;
    delete userData.virtual_Consultations;
    delete userData.newClientProjects;
    delete userData.destinationProject;
    delete userData.feeStructure;
    delete userData.tradeDiscount;
    delete userData.minBudget;
    delete userData.maxBudget;
    delete userData.weeklySchedule;
    delete userData.availability;
    delete userData.goals;
    delete userData.preferences;
    delete userData.projectSize;
    delete userData.styles;
    delete userData.isSignUp;
    delete userData.isApproved;
    delete userData.isIndefinitely;
    delete userData.inviteesSchedule;
    delete userData.saveProfiles;
    delete userData.saveImages;
    delete userData.subscription;
    delete userData.stripe;
    delete userData.needHelp;
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
