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

// export const createUserNumber = async (phoneNumber) => {
//   const check = await User.findOne({
//     phoneNumber: phoneNumber,
//     isDeleted: false,
//     isVerify: true,
//   });
//   console.log(check);
//   if (!check) {
//     const user = await User.create({ phoneNumber: phoneNumber });
//     return user;
//   } else {
//     return check;
//   }
// };
// export const verifyOtp = async (otp, tokenId, userId) => {
//   const user = await User.findOne({ _id: userId, isDeleted: false });
//   if (!user) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }
//   let currentTime = new Date();
//   const token = await Token.findOne({ _id: tokenId });

//   // console.log(token.otp.expiresAt,currentTime)
//   if (token.otp.expiresAt < currentTime) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.OTP_EXPIRE
//     );
//   }
//   if (token.phoneNumber && token.otp.code == otp) {
//     const user = await User.findOne({ _id: userId, isDeleted: false });
//     const tokenVerify = await Token.findOneAndUpdate(
//       { _id: tokenId },
//       { "otp.code": "", phoneNumber: "", isDeleted: true, isBlocked: true }
//     );
//     return user;
//   }

//   if (token.otp.code == otp) {
//     const userVerify = await User.findOneAndUpdate(
//       { _id: userId },
//       { isVerify: true },
//       { new: true }
//     );
//     const tokenVerify = await Token.findOneAndUpdate(
//       { _id: tokenId },
//       { "otp.code": "" }
//     );

//     return { userVerify, tokenVerify };
//   } else {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.VERIFY_UNMATCH
//     );
//   }
// };
// export const userLogin = async (data) => {
//   console.log(data);
//   let user = await User.findOne({
//     email: data.email,
//     type: data.type,
//     isVerify: true,
//     isDeleted: false,
//   });

//   if (!user) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.EMAIL_NOT_FOUND
//     );
//     // throw new ApiError(
//     //   ERROR_MESSAGES.EMAIL_NOT_FIND
//     //   // httpStatus.UNAUTHORIZED,
//     //   // "Email does not exist please signup"
//     // );
//   }

//   if (user.isBlocked) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.ACCOUNT_BLOCKED
//     );
//   }

//   if (user.isDeleted) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.ACCOUNT_DELETED
//     );
//   }

//   if (!(await user.isPasswordMatch(data.password))) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.WRONG_PASSWORD
//     );
//   }
//   await formatUser(user);

//   return user;
// };

// export const userSocialLogin = async (data) => {
//   // const check = await User.findOne({
//   //   $or: [
//   //     { facebookId: data.socialId },
//   //     { appleId: data.socialId },
//   //     { googleId: data.socialId },
//   //   ],
//   //   isDeleted: false,
//   // });
//   if (data.socialType == "facebook") {
//     const user = await User.findOneAndUpdate(
//       {
//         facebookId: data.socialId,
//         isDeleted: false,
//       },
//       {
//         $setOnInsert: {
//           name: data.name,
//         },
//         $set: { facebookId: data.socialId },
//       },
//       { upsert: true, new: true }
//     );
//     return user;
//   }
//   if (data.socialType == "apple") {
//     const user = await User.findOneAndUpdate(
//       {
//         appleId: data.socialId,
//         isDeleted: false,
//       },
//       {
//         $setOnInsert: {
//           name: data.name,
//         },
//         $set: { appleId: data.socialId },
//       },
//       { upsert: true, new: true }
//     );
//     return user;
//   }
//   if (data.socialType == "google") {
//     const user = await User.findOneAndUpdate(
//       {
//         googleId: data.socialId,
//         isDeleted: false,
//       },
//       {
//         $setOnInsert: {
//           name: data.name,
//         },
//         $set: { googleId: data.socialId },
//       },
//       { upsert: true, new: true }
//     );

//     return user;
//   }
// };

// export const getUserById = async (userId) => {
//   const user = await User.findById(userId).lean();

//   if (!user) {
//     throw new OperationalError(
//       STATUS_CODES.NOT_FOUND,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }

//   return user;
// };

// export const userLogout = async (tokenId) => {
//   const token = await Token.findOne({
//     _id: tokenId,
//     isDeleted: false,
//   });

//   if (!token) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.AUTHENTICATION_FAILED
//     );
//   }
//   if (token.isDeleted) {
//     throw new OperationalError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.LOG_OUT);
//   }
//   await Token.findByIdAndUpdate(
//     { _id: tokenId },
//     { isDeleted: true },
//     { new: true }
//   );
//   return;
// };

// export const resetPassword = async (tokenData, newPassword) => {
//   let query = tokenData.user;
//   newPassword = await bcrypt.hash(newPassword, 8);
//   if (tokenData.role === USER_TYPE.USER) {
//     const userdata = await User.findOneAndUpdate(
//       { _id: query },
//       { $set: { password: newPassword } }
//     );
//     const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
//       isDeleted: true,
//     });
//     return { userdata, tokenvalue };
//   }

//   const adminvalue = await Admin.findOneAndUpdate(
//     { _id: query },
//     { $set: { password: newPassword } }
//   );
//   const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
//     isDeleted: true,
//   });

//   return { tokenvalue, adminvalue };
// };

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
// export const changePassword = async (userId, oldPassword, newPassword) => {
//   const user = await User.findById(userId);
//   if (!(await bcrypt.compare(oldPassword, user.password))) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.OLD_PASSWORD
//     );
//   }
//   let updatedPassword = { password: newPassword };
//   Object.assign(user, updatedPassword);
//   await user.save();
//   return user;
// };
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
