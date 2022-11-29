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
      delete userData.documents;
      delete userData.age;
      delete userData.emergencyContact;
      delete userData.employementLocation;
      delete userData.documentLink;
      delete userData.contact;
      delete userData.fullName;
      delete userData.workType;
      
    }
    return userData;
  };

  const formatDeal=(userData) => {
   
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
      delete userData.vendorId
    
      
    }
    return userData;
  };
  const formatBanner=(userData) => {
   
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
      delete userData.vendorId
    
      
    }
    return userData;
  };

const formatResturant=(userData) => {
   
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
    delete userData.vendorId
  
    
  }
  return userData;
};

  module.exports={
    successMessageWithoutData ,
    successMessage,
    formatDeal,
    formatBanner,
    formatResturant
  }