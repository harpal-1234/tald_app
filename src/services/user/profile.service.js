const { successResponse } = require("../../utils/response");
const { User, Deal } = require("../../models");
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
  const userEmail = await User.findOne({ email: data.email, isDeleted: false });
  if (userEmail) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }

  const updateUser = await User.findByIdAndUpdate(
    { _id: data.id },
    {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    }
  );
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

const contactUs = async (name, email) => {
  const user = await User.findOne({
    $and: [{ email: email }, { name: name }],
    isDeleted: false,
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_CREDENTIAL
    );
  }
  return;
};

const pushNotificationStatus = async (req, res) => {
  const user = await User.findOne({ id: req.token.user._id });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  console.log(user.isPushNotification);
  if (user.isPushNotification === false) {
    console.log("working");
    const notification = await User.findOneAndUpdate(
      { _id: user.id },
      {
        isPushNotification: true,
      },
      { new: true, upsert: false }
    );
    console.log(notification);

    return notification;
  }
  if (user.isPushNotification === true) {
    console.log("working in ehh");
    const notification = await User.findOneAndUpdate(
      { _id: user.id },
      {
        isPushNotification: false,
      },
      { new: true, upsert: false }
    );

    return notification;
  }
};

const userLocation = async (req, res) => {
  const user = await User.findOne({ _id: req.token.user._id });
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
        address: req.body.address,
        loc: {
          coordinates: [req.body.long, req.body.lat],
        },
      },
    },
    { upsert: false }
  );

  return;
};

const favourites = async (req, res) => {
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

  if (user.dealId.length) {
    user.dealId.map(async (data) => {
      if (data.toString() === req.body.dealId) {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $pull: { dealId: req.body.dealId } },
          { new: true }
        );
        return;
      } else {
        const favourite = await User.updateOne(
          { _id: user.id },
          { $push: { dealId: req.body.dealId } },
          { new: true }
        );
        return;
      }
    });
  } else {
    const favourite = await User.updateOne(
      { _id: user.id },
      { $push: { dealId: req.body.dealId } },
      { new: true }
    );
    return;
  }
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
  const favourite = await User.findOne({ _id: user.id })
    .populate({ path: "dealId" })
    .lean();
  return favourite;
};

module.exports = {
  editProfile,
  changePassword,
  contactUs,
  userLocation,
  pushNotificationStatus,
  favourites,
  myFavourites,
};
