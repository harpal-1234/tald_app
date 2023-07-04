import jwt from "jsonwebtoken";

import moment from "moment";
import { ObjectID } from 'mongodb';

import config from "../config/config.js";
import {
  TOKEN_TYPE,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  DEVICE_TYPE,
} from "../config/appConstants.js";
import { Token, User } from "../models/index.js";
// import  { workSeekerProfileService } from "../services";
import { OperationalError } from "../utils/errors.js";
import { formatUser } from "../utils/formatResponse.js";
// const { verifyAccount } = require("../utils/sendMail");

export const generateToken = (data, secret = config.jwt.secret) => {
  const payload = {
    // user: data.user,
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
  };

  return jwt.sign(payload, secret);
};

export const saveToken = async (data) => {
  // console.log("-------------------------------")

  let dataToBesaved = {
    expires: data.tokenExpires.toDate(),
    type: data.tokenType,
    _id: data.tokenId,
    //device: { type: data.deviceType, token: data.deviceToken },
    role: data.userType,
    token: data.token,
    type:data.type
  };

  if (data.userType === USER_TYPE.ADMIN) {
    dataToBesaved.admin = data.user._id;
  }
  if (data.userType === USER_TYPE.USER) {
    dataToBesaved.user = data.user._id;
  }

  const tokenDoc = await Token.create(dataToBesaved);

  return tokenDoc;
};

export const generateAuthToken = async (
  user,
  userType,
  // deviceToken,
  //deviceType,
  type
) => {
  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, "days");

  var tokenId = new ObjectID();
  const accessToken = generateToken({
    // user: user._id,

    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
    type
  });

  const data = await saveToken({
    token: accessToken,
    tokenExpires,
    tokenId,
    // deviceToken,
    // deviceType,
    tokentype: TOKEN_TYPE.ACCESS,
    userType,
    user,
    type
  });

  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

export const adminverifyToken = async (tokenData, admintype) => {
  const payload = jwt.verify(tokenData.token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    tokenData,
    isDeleted: false,
    role: admintype,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

export const refreshAuth = async (user, userType, tokenId) => {
  await Token.findByIdAndUpdate(tokenId, { isDeleted: true });
  return generateAuthToken(user, userType);
};

export const logout = async (tokenId) => {
  const token = await Token.findOne({ _id: tokenId, isDeleted: false });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if (token.isDeleted) {
    throw new OperationalError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.LOG_OUT);
  }

  const updatedToken = await Token.findByIdAndUpdate(tokenId, {
    isDeleted: true,
  });

  return updatedToken;
};

export const generateResetPasswordToken = async (email,type) => {
  const user = await User.findOne({ email: email,type:type });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  if (user.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }

  var tokenId = new ObjectID();
  const tokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );

  const resetPasswordToken = generateToken({
    user: user.id,
    tokenId,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    type:type
  });

  const data = await saveToken({
    token: resetPasswordToken,
    tokenId,
    resetPasswordToken,
    user,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    userType: USER_TYPE.USER,
    type:type
  });

  return { resetPasswordToken };
};

export const generateVendorResetPassword = async (email) => {
  const user = await Store.findOne({ email: email });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  if (user.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }

  var tokenId = new ObjectID();
  const tokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );

  const resetPasswordToken = generateToken({
    vendor: user.id,
    tokenId,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
  });

  const data = await saveToken({
    token: resetPasswordToken,
    tokenId,
    resetPasswordToken,
    user,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    userType: USER_TYPE.VENDOR_ADMIN,
  });

  return { resetPasswordToken };
};

export const verifyResetPasswordToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);

    const tokenData = await Token.findOne({
      _id: payload.id,
      isDeleted: false,
      // expires: { $gte: new Date() },
    });

    return tokenData;
  } catch (error) {
    throw error;
  }
};

// export default {
//   generateVendorResetPassword,
//   generateAuthToken,
//   saveToken,
//   refreshAuth,
//   logout,
//   adminverifyToken,
//   generateResetPasswordToken,
//   verifyResetPasswordToken,
// };
