import { Admin, Token, User, Request } from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";

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
  const users = await User.find()
    .skip(page * limit)
    .limit(limit);

  return users;
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
      { status: true },
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
      { status: false, isReject: true },
      { new: true }
    );
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

  return request;
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
