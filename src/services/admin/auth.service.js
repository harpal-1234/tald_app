import { Admin, Token, User } from "../../models/index.js";
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

export const dashBoard = async (adminId) => {
  const users = await User.countDocuments({ isDeleted: false });
  const groups = await Group.countDocuments({ isDeleted: false });
  const revenue = 0;
  return { users, groups, revenue };
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
// export const createGroup = async (data) => {
//   const group = await Group.create(data);
//   return group;
// };
// export const getGroup = async (page, limit, search) => {
//   const skip = page * limit;
//   if (search) {
//     const group = await Group.find({
//       isDeleted: false,
//       $or: [
//         { groupName: { $regex: new RegExp(search, "i") } },
//         // { phoneNumber: { $regex: new RegExp(search, "i") } },
//         // { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .lean()
//       .skip(skip)
//       .limit(limit);
//     const totalGroups = await Group.countDocuments({
//       isDeleted: false,
//       $or: [
//         { groupName: { $regex: new RegExp(search, "i") } },
//         // { phoneNumber: { $regex: new RegExp(search, "i") } },
//         // { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     });
//     group.forEach((val) => {
//       val.totalMemeber = val.groupMember.length;
//     });
//     return { group, totalGroups };
//   }
//   const group = await Group.find({ isDeleted: false })
//     .lean()
//     .skip(skip)
//     .limit(limit);
//   const totalGroups = await Group.countDocuments({ isDeleted: false });
//   group.forEach((val) => {
//     val.totalMemeber = val.groupMember.length;
//   });
//   return { group, totalGroups };
// };
// export const getUser = async (page, limit, search) => {
//   const skip = page * limit;
//   if (search) {
//     const users = await User.find({
//       isDeleted: false,
//       $or: [
//         { name: { $regex: new RegExp(search, "i") } },
//         { phoneNumber: { $regex: new RegExp(search, "i") } },
//         { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .lean()
//       .skip(skip)
//       .limit(limit)
//       .sort({ _id: -1 });
//     const total = await User.countDocuments({
//       isDeleted: false,
//       $or: [
//         { name: { $regex: new RegExp(search, "i") } },
//         { phoneNumber: { $regex: new RegExp(search, "i") } },
//         { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .lean()
//       .sort({ _id: -1 });
//     return { users, total };
//   }
//   const users = await User.find({ isDeleted: false })
//     .lean()
//     .skip(skip)
//     .limit(limit)
//     .sort({ _id: -1 });
//   const total = await User.countDocuments({ isDeleted: false })
//     .lean()
//     .sort({ _id: -1 });

//   return { users, total };
// };
// export const allUser = async (search) => {
//   if (search) {
//     const users = await User.find({
//       isDeleted: false,
//       $or: [
//         { name: { $regex: new RegExp(search, "i") } },
//         { phoneNumber: { $regex: new RegExp(search, "i") } },
//         { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .lean()
//       .sort({ _id: -1 });
//     const total = await User.countDocuments({
//       isDeleted: false,
//       $or: [
//         { name: { $regex: new RegExp(search, "i") } },
//         { phoneNumber: { $regex: new RegExp(search, "i") } },
//         { profession: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .lean()
//       .sort({ _id: -1 });
//     return { users, total };
//   }
//   const users = await User.find({ isDeleted: false }).lean().sort({ _id: -1 });
//   const total = await User.countDocuments({ isDeleted: false })
//     .lean()
//     .sort({ _id: -1 });

//   return { users, total };
// };
// export const userActions = async (userId) => {
//   const check = await User.findOne({ _id: userId, isDeleted: false });
//   if (!check) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }
//   if (check.isBlocked) {
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       { isBlocked: false }
//     );
//     return "User unBlocked successfully";
//   } else {
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       { isBlocked: true }
//     );
//     return "User Blocked successfully";
//   }
// };
// export const userDelete = async (userId) => {
//   const check = await User.findOne({ _id: userId, isDeleted: false });
//   if (!check) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.USER_NOT_FOUND
//     );
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: userId },
//     { isDeleted: true }
//   );
//   return "User deleted successfully";
// };
// export const groupDelete = async (groupId) => {
//   const check = await Group.findOne({ _id: groupId, isDeleted: false });
//   if (!check) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.GROUP_NOT_EXIST
//     );
//   }

//   const user = await Group.findOneAndUpdate(
//     { _id: groupId },
//     { isDeleted: true }
//   );
//   return "Group deleted successfully";
// };

// export default{
//   adminLogin,
//   changePassword,
//   dashBoard,
//   adminLogout,
//   createGroup,
//   getGroup,
//   getUser,
//   userActions,
//   userDelete,
//   groupDelete,
//   allUser,
// };
