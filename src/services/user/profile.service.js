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
const { findOneAndUpdate } = require("../../models/token.model");

const editProfile = async (id, userData) => {
  const user = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const birthDate = new Date(userData.dateOfBirth);
const currentDate = new Date();
var yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
  yearDiff--;
}
  const updateUser = await User.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    {
      name: userData.name,
      images: userData.images,
      // phoneNumber: userData.phoneNumber,
      profession: userData.profession,
      bio: userData.bio,
      pronoun: userData.pronoun,
      politicalViews: userData.politicalViews,
      sign: userData.sign,
      genderIdentity: userData.genderIdentity,
      prefrences: userData.prefrences,
      lifeStyles: userData.lifeStyles,
      drugUsages: userData.drugUsages,
      hobbiesAndInterests: userData.hobbiesAndInterests,
      pets: userData.pets,
      dateOfBirth:userData.dateOfBirth,
      age:yearDiff,
      lookingFor: userData.lookingFor,
      loc: {
        address: userData.address,
        coordinates: [userData.long, userData.lat],
      },
    },
    { upsert: false, new: true }
  ).lean();
  return updateUser;
};

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

const contactUs = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONTACTUS_EMAIL_USER
    );
  }
  return user;
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
const deleteUser = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  return user;
};
const userLocation = async (data, userData) => {
  const user = await User.findOne({ _id: data, isDeleted: false });
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
const notification = async (userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).populate({
    path: "notifications.notificationId",
  });
  return user;
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
  notification,
  deleteUser,
};
