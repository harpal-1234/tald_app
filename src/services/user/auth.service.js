const bcrypt = require("bcryptjs");
// const { tokenService } = require("../../services");
const { successResponse } = require("../../utils/response");
const { User, Token, Admin } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51MKSEVLBN7xbh0EQH9R2gQi1pon2Do6OQPdXKcAXfqQMWkn7OYwwBb2LRUJFElYeVpVJkkI5Dffgxlj2QjBakBp700a1efzUf0"
);
const {
  joi,
  loginType,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  POPULATE_SKILLS,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");

const createUser = async (userData) => {
  const data = await User.findOne({
    email: userData.email,
    type: userData.type,
    isDeleted: false,
  });
  if (data) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  const user = await User.create(userData);
  const customer = await stripe.customers.create({
    userId: user._id,
    email: userData.email,
    name: userData.name,
    phone: userData.phoneNumber,
    address: {
      line1: "510 Townsend St",
      postal_code: "98140",
      city: "San Francisco",
      state: "CA",
      country: "US",
    },
    description: "Payment",
  });
  
  const check = await User.findOneAndUpdate(
    { _id: user._id },
    { stripeId: customer.id},
    { new: true }
  );
  console.log(check)
  return user;
};
const userLogin = async (email, password, type) => {
  let user = await User.findOne({
    $and: [{ email: email, type: type, isDeleted: false }],
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
    // throw new ApiError(
    //   ERROR_MESSAGES.EMAIL_NOT_FIND
    //   // httpStatus.UNAUTHORIZED,
    //   // "Email does not exist please signup"
    // );
  }

  if (user.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }

  if (user.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_DELETED
    );
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }

  return user;
};

const userSocialLogin = async (data) => {
  const user = await User.findOne({
    socialId: data.socialId,
    type: data.type,
    isDeleted: false,
  });

  if (user) {
    return user;
  }

  const newUser = await User.create(data);

  return newUser;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return user;
};

const userLogout = async (userId, type) => {
  const token = await Token.findOne({
    _id: userId,
    type: type,
    isDeleted: false,
  });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if (token.isDeleted) {
    throw new OperationalError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.LOG_OUT);
  }
  await Token.findByIdAndUpdate(
    { _id: userId },
    { isDeleted: true },
    { new: true }
  );
  return;
};

const resetPassword = async (tokenData, newPassword) => {
  let query = tokenData.user;
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.USER) {
    const userdata = await User.findOneAndUpdate(
      { _id: query },
      { $set: { password: newPassword } }
    );
    const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
      isDeleted: true,
    });
    return { userdata, tokenvalue };
  }

  const adminvalue = await Admin.findOneAndUpdate(
    { _id: query },
    { $set: { password: newPassword } }
  );
  const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
    isDeleted: true,
  });

  return { tokenvalue, adminvalue };
};

const pushNotification = async (userId) => {
  const data = await User.findOne({ _id: userId, isDeleted: false });
  if (data.isNotification == "Enable") {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        isNotification: "Disable",
      },
      { new: true }
    );
    return "Disable";
  }
  if (data.isNotification == "Disable") {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        isNotification: "Enable",
      },
      { new: true }
    );
  }
  return "Enable";
};
// const app_key_provider = {
//   getToken() {
//     return config.onesignal_api_key;
//   },
// };
// const configuration = OneSignal.createConfiguration({
//   authMethods: {
//     app_key: {
//       tokenProvider: app_key_provider,
//     },
//   },
// });
//   const client = new OneSignal.DefaultApi(configuration);
//   const notification = new OneSignal.Notification();

//   notification.app_id = config.onesignal_app_key;
//   notification.included_segments = [req.token.device.token];
//   notification.contents = {
//     en: "Hello OneSignal!",
//   };
//   const { id } = await client.createNotification(notification);

//   const response = await client.getNotification(config.onesignal_app_key, id);
//   console.log(response);

//   return response;
// };

module.exports = {
  userSocialLogin,
  createUser,
  userLogin,
  userLogout,
  resetPassword,
  pushNotification,
  getUserById,
};

// if (socialId) {
//   const newUser = await User.findOne({ email: email });

//   if (newUser) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.EMAIL_ALREADY_EXIST
//     );
//   }

//   if (Object.keys(socialId).toString() === "facebookId") {
//     const facebookUser = await User.create({
//       email: email,
//       name: name,
//       socialId: socialId,
//     });
// const facebookUser = await User.findOneAndUpdate(
//   { $or: [{ socialId: socialId.facebookId }, { email: email }] },
//   {
//     $set: { socialId: { facebookId: socialId.facebookId } },
//     $setOnInsert: {
//       email: email,
//       name: name,
//     },
//   },
//   { upsert: true, new: true }
// );

//   return facebookUser;
// }

// if (Object.keys(socialId).toString() === "googleId") {
//   const googleUser = await User.create({
//     email: email,
//     name: name,
//     socialId: socialId,
//   });

//   return googleUser;
// }
// if (Object.keys(socialId).toString() === "appleId") {
//   const appleUser = await User.create({
//     email: email,
//     name: name,
//     socialId: socialId,
//   });
// const appleUser = await User.findOneAndUpdate(
//   { $or: [{ socialId: socialId.appleId }, { email: email }] },
//   {
//     $set: { socialId: { appleId: socialId.appleId } },
//     $setOnInsert: {
//       email: email,
//       name: name,
//     },
//   },
//   { upsert: true, new: true }
// );

//     return appleUser;
//   }
// }
