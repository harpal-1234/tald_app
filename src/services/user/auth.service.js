const bcrypt = require("bcryptjs");
// const { tokenService } = require("../../services");
const { successResponse } = require("../../utils/response");
const { User, Token, Admin, Store } = require("../../models");
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

const createUser = async (userData, userId) => {
  const data = await User.findOne({
    _id: userId,
    isDeleted: false,
  });
  const birthDate = new Date(userData.dateOfBirth);
  const currentDate = new Date();
  var yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    yearDiff--;
  }
  if (data.facebookId || data.appleId || data.googleId) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        name: userData.name,
        images: userData.images,
        phoneNumber: userData.phoneNumber,
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
        dateOfBirth: userData.dateOfBirth,
        age: yearDiff,
        lookingFor: userData.lookingFor,
        address: userData.address,
        $set: {
          location: {
            type: "Point",
            coordinates: [userData.long, userData.lat],
          },
        },
        isVerify: true,
      },
      { new: true }
    );
    const customer = await stripe.customers.create({
      userId: user._id,
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
    return user;
  }
  console.log(data.phoneNumber, userData.phoneNumber);
  if (data.phoneNumber !== userData.phoneNumber) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PHONE_NOT_MATCH
    );
  }
  console.log(userData.long, userData.lat);
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      name: userData.name,
      images: userData.images,
      phoneNumber: userData.phoneNumber,
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
      dateOfBirth: userData.dateOfBirth,
      age: yearDiff,
      lookingFor: userData.lookingFor,
      address: userData.address,
      $set: {
        location: { type: "Point", coordinates: [userData.long, userData.lat] },
      },
      isVerify: true,
    },
    { new: true }
  );
  const customer = await stripe.customers.create({
    userId: user._id,
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
  // const check = await User.findOneAndUpdate(
  //   { _id: user._id },
  //   { stripeId: customer.id },
  //   { new: true }
  // );
  // console.log(check);
  // console.log(user);
  return user;
};
const createUserNumber = async (phoneNumber) => {
  const check = await User.findOne({
    phoneNumber: phoneNumber,
    isDeleted: false,
    isVerify: true,
  });
  console.log(check);
  if (!check) {
    const user = await User.create({ phoneNumber: phoneNumber });
    return user;
  } else {
    return check;
  }
};
const verifyOtp = async (otp, tokenId, userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  let currentTime = new Date();
  const token = await Token.findOne({ _id: tokenId });

  // console.log(token.otp.expiresAt,currentTime)
  if (token.otp.expiresAt < currentTime) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OTP_EXPIRE
    );
  }
  if (token.phoneNumber && token.otp.code == otp) {
    const user = await User.findOne({ _id: userId, isDeleted: false });
    const tokenVerify = await Token.findOneAndUpdate(
      { _id: tokenId },
      { "otp.code": "", phoneNumber: "", isDeleted: true, isBlocked: true }
    );
    return user;
  }

  if (token.otp.code == otp) {
    const userVerify = await User.findOneAndUpdate(
      { _id: userId },
      { isVerify: true },
      { new: true }
    );
    const tokenVerify = await Token.findOneAndUpdate(
      { _id: tokenId },
      { "otp.code": "" }
    );

    return { userVerify, tokenVerify };
  } else {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.VERIFY_UNMATCH
    );
  }
};
const userLogin = async (phoneNumber) => {
  // let user = await User.findOne({
  //   email: email,
  //   isDeleted: false,
  // });
  const user = await findOne({
    phoneNumber: phoneNumber,
    isVerify: true,
    isDeleted: true,
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PHONE_NOT_EXIST
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

  // if (!(await user.isPasswordMatch(password))) {
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.WRONG_PASSWORD
  //   );
  // }

  return user;
};

const userSocialLogin = async (data) => {
  const check = await User.findOne({
    $or: [
      { facebookId: data.socialId },
      { appleId: data.socialId },
      { googleId: data.socialId },
    ],
    isDeleted: false,
  });
  if (data.socialType == "facebook") {
    const user = await User.findOneAndUpdate(
      {
        facebookId: data.socialId,
        isDeleted: false,
      },
      {
        $setOnInsert: {
          name: data.name,
        },
        $set: { facebookId: data.socialId },
      },
      { upsert: true, new: true }
    );
    return user;
  }
  if (data.socialType == "apple") {
    const user = await User.findOneAndUpdate(
      {
        appleId: data.socialId,
        isDeleted: false,
      },
      {
        $setOnInsert: {
          name: data.name,
        },
        $set: { appleId: data.socialId },
      },
      { upsert: true, new: true }
    );
    // if (!check) {
    //   const customer = await stripe.customers.create({
    //     userId: user._id,
    //     email: userData.email,
    //     name: userData.name,
    //     phone: userData.phoneNumber,
    //     address: {
    //       line1: "510 Townsend St",
    //       postal_code: "98140",
    //       city: "San Francisco",
    //       state: "CA",
    //       country: "US",
    //     },
    //     description: "Payment",
    //   });
    // }
    return user;
  }
  if (data.socialType == "google") {
    const user = await User.findOneAndUpdate(
      {
        googleId: data.socialId,
        isDeleted: false,
      },
      {
        $setOnInsert: {
          name: data.name,
        },
        $set: { googleId: data.socialId },
      },
      { upsert: true, new: true }
    );
    // if (!check) {
    //   const customer = await stripe.customers.create({
    //     userId: user._id,
    //     email: userData.email,
    //     name: userData.name,
    //     phone: userData.phoneNumber,
    //     address: {
    //       line1: "510 Townsend St",
    //       postal_code: "98140",
    //       city: "San Francisco",
    //       state: "CA",
    //       country: "US",
    //     },
    //     description: "Payment",
    //   });
    // }
    return user;
  }
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
const publickKey = async (publickKey, userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
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
  createUserNumber,
  verifyOtp,
  publickKey,
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
