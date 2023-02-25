const { successResponse } = require("../../utils/response");
const { User, Deal, Store } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const bcrypt = require("bcryptjs");

const editProfile = async (id, data) => {
  if(data.type == "Vendor"){
  const userEmail = await User.findOne({ _id: id, type:"Vendor",isDeleted: false });

  if (!userEmail) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOne({ email: data.email, type:"Vendor", isDeleted: false });

  if (user) {
    if (user.email !== userEmail.email) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    { _id: id , type:"Vendor",isDeleted:false },
    {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
    { upsert: false, new: true }
  ).lean();
  return updateUser;
};
if(data.type == "User"){
  const userEmail = await User.findOne({ _id: id, type:"User",isDeleted: false });

  if (!userEmail) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOne({ email: data.email, type:"User",isDeleted: false });

  if (user) {
    if (user.email !== userEmail.email) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    { _id: id ,type:"User",isDeleted:false},
    {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
    { upsert: false, new: true }
  ).lean();
  return updateUser;
}
}


const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OLD_PASSWORD
    );
  }

  let updatedPassword = { password: newPassword };

  Object.assign(user, updatedPassword);
  const va = await user.save();

  return user;
};

const contactUs = async (data) => {
  if(data.type == "Vendor"){
  const user = await User.findOne({ email: data.email,type:"Vendor", isDeleted: false });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONTACTUS_EMAIL_USER
    );
  }
  return user;
}
if(data.type == "User"){
  const user = await User.findOne({ email: data.email, type:"User",isDeleted: false });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONTACTUS_EMAIL_USER
    );
  }
  return user;

}
};

const pushNotificationStatus = async (data) => {
  const user = await User.findOne({ _id: data, isDeleted: false });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  if (user.isPushNotification) {
    const notification = await User.findOneAndUpdate(
      { _id: user.id },
      {
        isPushNotification: false,
      },
      { new: true }
    );

    return notification;
  } else {
    const notification = await User.findOneAndUpdate(
      { _id: user.id },
      {
        isPushNotification: true,
      },
      { new: true }
    );

    return notification;
  }
};

const userLocation = async (data,userData) => {
  
  const user = await User.findOne({ _id:data,isDeleted:false });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const userLocation = await User.findByIdAndUpdate(
    { _id: user.id },
    {
      location: {
        address: userData.address,
        loc: {
          coordinates: [userData.long, userData.lat],
        },
      },
    },
    { upsert: false }
  );

  return;
};

const myFavourites = async (req, res) => {
  const user = await User.findOne({
    _id: req.token.user._id,
    isDeleted: false,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const favourite = await User.findOne({ _id: user.id, isDeleted: false })
    .populate({ path: "favouriteStores" })
    .lean();
  const count = favourite.favouriteStores.length;

  return { favourite, count };
};

const dealPurchaseData = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const purchaseData = await User.findOne({ _id: user.id })
    .populate({ path: "dealPurchaseId" })
    .lean();
  return purchaseData;
};

const favouriteStoreDeal = async (req, res) => {
  const store = await Store.findOne({
    _id: req.query.storeId,
    isDeleted: false,
  });
  if (!store) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.STORE_NOT_EXIST
    );
  }
  const favourite = await Store.findOne({ _id: store.id, isDeleted: false })
    .populate({ path: "deals" })
    .lean();

  return favourite;
};

module.exports = {
  editProfile,
  changePassword,
  contactUs,
  userLocation,
  pushNotificationStatus,
  myFavourites,
  dealPurchaseData,
  favouriteStoreDeal,
};
