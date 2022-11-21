const jwt = require("jsonwebtoken");

const moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

const config = require("../config/config");
const {
  TOKEN_TYPE,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../config/appConstants");
const { Token, Admin ,User} = require("../models");
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
    // device: { type: data.DEVICE_TYPE, token: data.deviceToken },
    role: data.userType,
    token: data.token,
  };
 
  if(data.userType === USER_TYPE.VENDOR_ADMIN)
  {
    dataToBesaved.vendor = data.user._id;
  }
  if (data.userType === USER_TYPE.ADMIN) {
    dataToBesaved.admin = data.user._id;
  } if(data.userType=== USER_TYPE.USER){
   
    // console.log(data.user._id,"daaataaa")
    // data.userType == USER_TYPE.USER
      // ? (dataToBesaved = data.user._id)
       //: (dataToBesaved = data.user._id);
    dataToBesaved.user = data.user._id;
  }
 

  const tokenDoc = await Token.create(dataToBesaved);
  // console.log(tokenDoc);
  return tokenDoc;
};

const generateAuthToken = async (user, userType) => {

  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, "days");

  var tokenId = new ObjectID();
  const accessToken = generateToken({
    // user: user._id,
    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
  });
 
  const data=await saveToken({
    token: accessToken,
    tokenExpires,
    tokenId,
    tokentype: TOKEN_TYPE.ACCESS,
    userType,
    user,
  });
  
  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

const adminverifyToken = async (tokenData,admintype) => {
  const payload = jwt.verify(tokenData.token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    tokenData,
    isDeleted:false,
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
  console.log(token);

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if(token.isDeleted){
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.LOG_OUT
    )
  }

  const updatedToken = await Token.findByIdAndUpdate(tokenId, {
    isDeleted: true,
  });
 
  return updatedToken;
};

const generateResetPasswordToken = async (email) => {
  const user= await User.findOne({email:email});
  
  if(!user)
  {
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
 
  const data=await saveToken({
    token: resetPasswordToken,
    tokenId,
    resetPasswordToken,
    user,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    userType:USER_TYPE.USER,
  });

  
  return { resetPasswordToken};
};

const verifyResetPasswordToken = async (token) => {
  try {
   console.log("working")
    
    const payload = jwt.verify(token, config.jwt.secret);

    const tokenData = await Token.findOne({
      _id: payload.id,
      isDeleted: false,
      // expires: { $gte: new Date() },
    });
    console.log(tokenData);
    return tokenData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAuthToken,
  saveToken,
  refreshAuth,
  logout,
  adminverifyToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
};
