import { Admin, Token, User, Request } from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
//import { formatUser } from "../../utils/formatResponse.js";
import { createVendorMail } from "../../utils/sendMail.js";
import { formatUser } from "../../utils/commonFunction.js";

export const adminLogin = async (email, password) => {
  const admin = await Admin.findOne({ email: email });

  if (!admin) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }
  if (!(await admin.isPasswordMatch(password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  return admin;
};
export const userList = async (page, limit) => {
  const users = await User.find({
    type: "User",
    isDeleted: false,
    isVerify: true,
  })
    .skip(page * limit)
    .limit(limit)
    .lean();
  const total = await User.countDocuments({
    type: "User",
    isDeleted: false,
    isVerify: true,
  });
  await formatUser(users);
  return { users, total };
};
export const vendorList = async (page, limit) => {
  const users = await User.find({
    type: "Vendor",
    isDeleted: false,
    isVerify: true,
  })
    .skip(page * limit)
    .limit(limit)
    .lean();
  const total = await User.countDocuments({
    type: "Vendor",
    isDeleted: false,
    isVerify: true,
  });
  await formatUser(users);
  return { users, total };
};
export const createVendor = async (email, name) => {
  const check = await User.findOne({
    email: email,
    isDeleted: false,
    isVerify: true,
  });
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const characters = "ABCDEFGHIJabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = getRandomNumber(0, characters.length - 1);
    password += characters.charAt(randomIndex);
  }

  const data = await User.create({
    email: email,
    name: name,
    password: password,
    isVerify: true,
    type: "Vendor",
    // adminUserPassword: password,
    isApproved: true,
  });
  console.log(data);
  createVendorMail(email, password, name);
  return;
};
export const requestAction = async (status, requestId) => {
  const check = await Request.findOne({ _id: requestId, isDeleted: false });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.REQUEST_NOT_FOUND
    );
  }
  if (status == true) {
    const request = await Request.findOneAndUpdate(
      {
        _id: requestId,
        isDeleted: false,
      },
      { status: true, isDeleted: true },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      { _id: check.sender, isDeleted: false },
      { isApproved: true },
      { new: true }
    );
  }
  if (status == false) {
    const request = await Request.findOneAndUpdate(
      {
        _id: requestId,
        isDeleted: false,
      },
      { status: false, isReject: true, isDeleted: true },
      { new: true }
    );
  }
};
export const userAction = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
    isVerify: true,
  });
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  if (user.isBlocked) {
    await User.findByIdAndUpdate(
      {
        _id: userId,
        isDeleted: false,
        isVerify: true,
      },
      { isBlocked: false },
      { new: true }
    );
    return false;
  } else {
    await User.findByIdAndUpdate(
      {
        _id: userId,
        isDeleted: false,
        isVerify: true,
      },
      { isBlocked: true },
      { new: true }
    );
    return true;
  }
};
export const requests = async (page, limit) => {
  const request = await Request.find({ isDeleted: false })
    .skip(page * limit)
    .limit(limit)
    .sort({ _id: -1 })
    .populate({
      path: "sender",
      select: [
        "email",
        "name",
        "companyName",
        "location",
        "address",
        "instagramLink",
        "pinterestLink",
        "about",
        "projectType",
        "virtual_Consultations",
        "newClientProjects",
        "destinationProject",
        "feeStructure",
        "tradeDiscount",
        "minBudget",
        "maxBudget",
        "weeklySchedule",
        "availability",
        "isIndefinitely",
        "inviteesSchedule",
      ],
    });
  const total = await Request.countDocuments({ isDeleted: false });
  return { request, total };
};
export const changePassword = async (adminId, oldPassword, newPassword) => {
  const admin = await Admin.findById(adminId);
  if (!(await admin.isPasswordMatch(oldPassword))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  let updatedPassword = { password: newPassword };
  Object.assign(admin, updatedPassword);
  await admin.save();
  return admin;
};
export const adminLogout = async (tokenId) => {
  const token = await Token.findOne({ _id: tokenId, isDeleted: false });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  const updatedToken = await Token.findByIdAndUpdate(tokenId, {
    isDeleted: true,
  });
  return updatedToken;
};
