const { Admin, Token, Banner, User } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const adminLogin = async (email, password) => {
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

const changePassword = async (adminId, oldPassword, newPassword) => {
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

const dashBoard = async (adminId) => {
  console.log(adminId);
  const admin = await Admin.findOne();
  console.log(admin);
  const totalUser = await User.countDocuments({
    type: "User",
    isDeleted: false,
  });
  const totalVendor = await User.countDocuments({
    type: "Vendor",
    isDeleted: false,
  });
  const data = [
    { title1: "Total Banners", data1: admin.orders.length },
    { title2: "Total Revanue", data2: admin.totalRevanue },
    { title3: "Total Users", data3: totalUser },
    { title4: "Total Vendors", data4: totalVendor },
  ];
  return data;
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

module.exports = {
  adminLogin,
  changePassword,
  dashBoard,
  adminLogout,
};
