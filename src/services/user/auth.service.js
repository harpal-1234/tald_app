import bcrypt from "bcryptjs";

// import  { tokenService } from "../../services";
import { successResponse } from "../../utils/response.js";
import { User, Token, Admin } from "../../models/index.js";
import { formatUser } from "../../utils/commonFunction.js";
//import  { ApiError } from "../../utils/universalFunction.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";

export const createUser = async (userData) => {
  const check = await User.findOne({
    email: userData.email,
    isDeleted: false,
  });
  if (check) {
    return check;
  }
  const user = await User.create({
    email: userData.email,
  });
  return user;
};

export const register = async (userData) => {
  console.log(userData);
  const check = await User.findOne({
    email: userData.email,
    isVerify: true,
    type: userData.type,
    isDeleted: false,
  });
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  const user = await User.create({
    email: userData.email,
    name: userData.name,
    password: userData.password,
    type: userData.type,
  });
  console.log(user);
  await formatUser(user);
  return user;
};
export const verifyEmail = async (token) => {
  const user = await Token.findOne({ token: token, isDeleted: false });

  const data = await User.findOneAndUpdate(
    { _id: user.user, isDeleted: false },
    { isVerify: true },
    { new: true }
  );
  // if (data.type == "Vendor") {
  //   const deals = await Deal.updateMany(
  //     { user: user.user, isDeleted: false },
  //     { isVerify: true }
  //   );
  //   console.log(deals);
  // }

  return data;
};
export const createService = async (userId, data) => {
  const check = await User.findOne({
    _id: userId,
    isVerify: true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      isVerify: true,
      isDeleted: false,
    },
    {
      companyName: data.companyName,
      location: {
        type: "Point",
        coordinates: [data.long, data.lat],
      },
      address: data.address,
      instagramLink: data.instagramLink,
      pinterestLink: data.pinterestLink,
      about: data.about,
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      feeStructure: data.feeStructure,
      tradeDiscount: data.tradeDiscount,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
    },
    { new: true }
  ).lean();
  await formatUser(user);
  return user;
};
export const userLogin = async (data) => {
  let user = await User.findOne({
    email: data.email,
    type: data.type,
    isVerify: true,
    isDeleted: false,
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
  console.log(await bcrypt.compare(data.password, user.password));

  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  // if (!(await user.isPasswordMatch(data.password))) {
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.WRONG_PASSWORD
  //   );
  // }

  await formatUser(user);

  return user;
};

export const userSocialLogin = async (data) => {
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

  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return user;
};

export const userLogout = async (tokenId) => {
  const token = await Token.findOne({
    _id: tokenId,
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
    { _id: tokenId },
    { isDeleted: true },
    { new: true }
  );
  return;
};

export const resetPassword = async (tokenData, newPassword) => {
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

// export const pushNotification = async (userId) => {
//   const data = await User.findOne({ _id: userId, isDeleted: false });
//   if (data.isNotification == "Enable") {
//     await User.findOneAndUpdate(
//       { _id: userId, isDeleted: false },
//       {
//         isNotification: "Disable",
//       },
//       { new: true }
//     );
//     return "Disable";
//   }
//   if (data.isNotification == "Disable") {
//     await User.findOneAndUpdate(
//       { _id: userId, isDeleted: false },
//       {
//         isNotification: "Enable",
//       },
//       { new: true }
//     );
//   }
//   return "Enable";
// };
// export const publickKey = async (publickKey, userId) => {
//   const user = await User.findOne({ _id: userId, isDeleted: false });
// };
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OLD_PASSWORD
    );
  }
  let updatedPassword = { password: newPassword };
  Object.assign(user, updatedPassword);
  await user.save();
  return user;
};
// export const editProfile = async (userId, data) => {
//   const user = await User.findOneAndUpdate(
//     { _id: userId },
//     {
//       image: data.image,
//       name: data.name,
//       email: data.email,
//     },
//     {
//       new: true,
//       lean: true,
//     }
//   );
//   const data1 = await formatUser(user);
//   return data1;
// };
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

// export default{
//   userSocialLogin,
//   createUser,
//   userLogin,
//   userLogout,
//   resetPassword,
//   pushNotification,
//   getUserById,
//   createUserNumber,
//   verifyOtp,
//   publickKey,
// };

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
