import {
  Admin,
  Token,
  User,
  Request,
  Filter,
  Consultations,
  ProjectInquery,
  projectRequest,
  Project,
  Subscriptions,
  Payment,
} from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
//import { formatUser } from "../../utils/formatResponse.js";
import { createVendorMail } from "../../utils/sendMail.js";
import { formatUser } from "../../utils/commonFunction.js";
import { getConsultations } from "../app.services.js/vendor.js";
import { payment } from "../user/auth.service.js";

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
export const userList = async (page, limit, search) => {
  const options = {
    isDeleted: false,
    // isVerify: true,
  };
  const escapedSearchTerm = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  if (search) {
    options.$or = [
      { name: { $regex: new RegExp(escapedSearchTerm, "i") } },
      { email: { $regex: new RegExp(escapedSearchTerm, "i") } },
    ];
  }
  const users = await User.find({
    type: "User",
    ...options,
  })
    .skip(page * limit)
    .limit(limit)
    .lean()
    .sort({ _id: -1 });
  const total = await User.countDocuments({
    type: "User",
    ...options,
  });
  await formatUser(users);
  return { users, total };
};
export const getClientDetails = async (userId, page, limit) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  }).lean();
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const ProjectInquerys = await projectRequest.countDocuments({
    isDeleted: false,
    user: userId,
  });
  const consultations = await Consultations.countDocuments({
    isDeleted: false,
    user: userId,
    isCancel: false,
  });
  const projects = await ProjectInquery.find({
    isDeleted: false,
    user: userId,
    // isCancel: false,
  });
  // .populate([
  //   {
  //     path: "projectId",
  //   },
  //   { path: "user", select: ["name", "email"] },
  //   { path: "designer", select: ["name", "email"] },
  // ])
  // .skip(page * limit)
  // .limit(limit)
  // .sort({ _id: -1 });
  await formatUser(user);
  const response = {
    user: user,
    totalProjectInqueries: ProjectInquerys,
    totalVirtualConsultation: consultations,
    projects,
  };
  return response;
};
export const getProjectInqueryStatus = async (projectId) => {
  const projects = await projectRequest
    .find({
      isDeleted: false,
      projectId: projectId,
      // isCancel: false,
    })
    .populate([
      {
        path: "projectId",
      },
      { path: "user", select: ["name", "email"] },
      { path: "designer", select: ["name", "email"] },
    ]);

  return projects;
};
export const getDesignerDetails = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    type: "Vendor",
    isDeleted: false,
  }).lean();
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const ProjectInquerys = await projectRequest.countDocuments({
    isDeleted: false,
    designer: userId,
    isConfirm: true,
  });
  const totalConsultations = await Consultations.countDocuments({
    isDeleted: false,
    designer: userId,
    // isCancel: false,
  });
  const pendingConsultations = await Consultations.countDocuments({
    isDeleted: false,
    designer: userId,
    isConfirm: false,
    // isCancel: false,
  });
  const bookConsultations = await Consultations.countDocuments({
    isDeleted: false,
    designer: userId,
    isConfirm: true,
    // isCancel: false,
  });
  const portfolio = await Project.find({
    isDeleted: false,
    user: userId,
  }).sort({ _id: -1 });
  await formatUser(user);
  const response = {
    designer: user,
    totalVirtualConsultation: totalConsultations,
    totalProjectInqueries: ProjectInquerys,
    pendingConsultations: pendingConsultations,
    bookConsultations: bookConsultations,
    totalProfileSave: user?.numberOfSaveProfiles
      ? user?.numberOfSaveProfiles
      : 0,
    totalImageSave: user?.numberOfSaveImage ? user?.numberOfSaveImage : 0,
    revenue: user?.totalRevenue ? user?.totalRevenue : 0,
    portfolio: portfolio,
  };
  return response;
};
export const getSubscription = async (page, limit) => {
  const subScriptions = await Subscriptions.find({ isDeleted: false })
    .populate({ path: "designer", select: ["name", "email"] })
    .skip(page * limit)
    .limit(limit)
    .sort({ _id: -1 });
  return subScriptions;
};
export const getConsultationPayments = async (page, limit) => {
  const payments = await Payment.find({ isDeleted: false })
    .populate([
      { path: "user", select: ["name", "email"] },
      { path: "designer", select: ["name", "email"] },
      { path: "consultationId" },
    ])
    .skip(page * limit)
    .limit(limit)
    .sort({ _id: -1 });
  return payments;
};
export const vendorList = async (page, limit, search) => {
  const options = {
    isDeleted: false,
    isApproved: true,
  };
  const escapedSearchTerm = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  if (search) {
    options.$or = [
      { name: { $regex: new RegExp(escapedSearchTerm, "i") } },
      { email: { $regex: new RegExp(escapedSearchTerm, "i") } },
    ];
  }
  const users = await User.find({
    type: "Vendor",
    ...options,
    // isVerify: true,
  })
    .skip(page * limit)
    .limit(limit)
    .lean()
    .sort({ _id: -1 });
  console.log("first");
  const total = await User.countDocuments({
    type: "Vendor",
    ...options,
    // isVerify: true,
  });
  await formatUser(users);
  return { users, total };
};
export const createVendor = async (email, name) => {
  const check = await User.findOne({
    email: email,
    isDeleted: false,
    // isVerify: true,
  });
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  // function getRandomNumber(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const specialCharacters = "!@#$%^&*";
  let password = "";
  const randomUppercase = String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  );
  const randomSpecialChar =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  password += randomUppercase + randomSpecialChar;
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
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
export const filterData = async (data) => {
  const check = await Filter.findOne({ isDeleted: false });
  if (!check) {
    console.log(data);
    const value = await Filter.create(data);
    return value;
  } else {
    return check;
  }
};
export const userAction = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
    // isVerify: true,
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
        //  isVerify: true,
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
        // isVerify: true,
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
export const dashboard = async (startDate, endDate) => {
  const options = {
    isDeleted: false,
  };
  if (startDate && endDate) {
    options.createdAt = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
  }
  const [
    virtualConsultation,
    ProjectInquerys,
    interiorDesigner,
    totalClient,
    totalRevenue,
  ] = await Promise.all([
    Consultations.countDocuments(options),
    ProjectInquery.countDocuments(options),
    User.countDocuments({ ...options, type: "Vendor" }),
    User.countDocuments({ ...options, type: "User" }),
    Admin.findOne(),
  ]);
  console.log(totalRevenue);
  const response = {
    virtualConsultation: virtualConsultation,
    ProjectInquerys: ProjectInquerys,
    interiorDesigner: interiorDesigner,
    totalClient: totalClient,
    consultationRevenue: totalRevenue?.consultationRevenue
      ? totalRevenue?.consultationRevenue
      : 0,
    membershipRevenue: totalRevenue?.membershipRevenue
      ? totalRevenue?.membershipRevenue
      : 0,
  };

  return response;
};
export const getConsultation = async (page, limit) => {
  const consultations = await Consultations.find({ isDeleted: false })
    .populate([
      { path: "designer", select: ["name", "email"] },
      { path: "user", select: ["name", "email"] },
    ])
    .sort({ _id: -1 })
    .skip(page * limit)
    .limit(limit);
  const totalConsultations = await Consultations.find({ isDeleted: false });

  return {
    consultations: consultations,
    totalConsultations: totalConsultations,
  };
};
export const approvedInqueryList = async (page, limit) => {
  const inqueryList = await projectRequest
    .find({ isDeleted: false, isVerify: true })
    .populate([
      { path: "designer", select: ["name", "email"] },
      { path: "user", select: ["name", "email"] },
    ])
    .sort({ _id: -1 })
    .skip(page * limit)
    .limit(limit);
  const totalInqueryList = await projectRequest.find({
    isDeleted: false,
    isVerify: true,
  });

  return {
    inqueryList: inqueryList,
    totalInqueryList: totalInqueryList,
  };
};

export const inqueryList = async (page, limit) => {
  const inqueryList = await projectRequest
    .find({ isDeleted: false, isVerify: false })
    .populate([
      { path: "designer", select: ["name", "email"] },
      { path: "user", select: ["name", "email"] },
    ])
    .sort({ _id: -1 })
    .skip(page * limit)
    .limit(limit);
  const totalInqueryList = await projectRequest.find({
    isDeleted: false,
    isVerify: false,
  });

  return {
    inqueryList: inqueryList,
    totalInqueryList: totalInqueryList,
  };
};

export const actionOnInquery = async (Id, status) => {
  let query;
  if (status == "Accept") {
    query.isVerify = true;
  }
  if (status == "Reject") {
    query.isReject = true;
  }
  const inquery = await projectRequest.findOneAndUpdate(
    {
      _id: Id,
      isDeleted: false,
      isVerify: false,
    },
    query,
    {
      new: true,
    }
  );
  // if(status == "Reject"){

  // }
  return inquery;
};
