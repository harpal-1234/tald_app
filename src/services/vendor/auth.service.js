const { User, Vendor, Deal, Token, Store } = require("../../models");
const bcrypt = require("bcryptjs");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const vendorLogin = async (email, password) => {

  const admin = await Store.findOne({ email: email });


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

const changePassword = async (adminId, oldPassword, newPassword) => {
 
  const admin = await Store.findById(adminId);
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

const dashBoard = async (req, res) => {
  const [totalDeals, deal] = await Promise.all([
    Deal.countDocuments({ isDeleted: false }),
    Deal.countDocuments({ isDeleted: false }),
  ]);
  return { totalDeals, deal };
};

const adminLogout = async (tokenId) => {
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

const resetPassword = async (tokenData, newPassword) => {
  let query = tokenData.vendor;
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.VENDOR_ADMIN) {
    const userdata = await Store.findOneAndUpdate(
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

module.exports = {
  vendorLogin,
  changePassword,
  dashBoard,
  adminLogout,
  resetPassword,
};
