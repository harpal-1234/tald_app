const jwt = require("jsonwebtoken");

const moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

const config = require("../config/config");
const {
  TOKEN_TYPE,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  DEVICE_TYPE,
} = require("../config/appConstants");
const { Token, Admin, User, Vendor, Store } = require("../models");
// const { workSeekerProfileService } = require("../services");
const { OperationalError } = require("../utils/errors");
const { formatUser } = require("../utils/formatResponse");
const { Console } = require("winston/lib/winston/transports");
// const { verifyAccount } = require("../utils/sendMail");

const generateToken = (data, secret = config.jwt.secret) => {
  const payload = {
    // user: data.user,
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
    
  };

  return jwt.sign(payload, secret);
};

const saveToken = async (data) => {
  // console.log("-------------------------------")

  let dataToBesaved = {
    expires: data.tokenExpires.toDate(),
    type: data.tokenType,
    _id: data.tokenId,
    //device: { type: data.deviceType, token: data.deviceToken },
    role: data.userType,
    token: data.token,
    otp:data.otp,
    phoneNumber:data.phoneNumber
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

const generateAuthToken = async (
  user,
  otp,
  userType,
  phoneNumber
 // deviceToken,
  //deviceType,
) => {

  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, "days");

  var tokenId = new ObjectID();
  const accessToken = generateToken({
    // user: user._id,

    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
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
    otp,
    phoneNumber
  });

  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

const adminverifyToken = async (tokenData, admintype) => {
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

const refreshAuth = async (user, userType, tokenId) => {
  await Token.findByIdAndUpdate(tokenId, { isDeleted: true });
  return generateAuthToken(user, userType);
};

const logout = async (tokenId) => {
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

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email: email });

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
  });

  const data = await saveToken({
    token: resetPasswordToken,
    tokenId,
    resetPasswordToken,
    user,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    userType: USER_TYPE.USER,
  });

  return { resetPasswordToken };
};

const generateVendorResetPassword = async (email) => {
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

const verifyResetPasswordToken = async (token) => {
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

module.exports = {
  generateVendorResetPassword,
  generateAuthToken,
  saveToken,
  refreshAuth,
  logout,
  adminverifyToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
};
