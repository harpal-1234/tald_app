import bcrypt from "bcryptjs";
import { User, Token, Admin, Request, Filter } from "../../models/index.js";
import { formatUser, formatVendor } from "../../utils/commonFunction.js";
import { editProfile } from "../../utils/sendMail.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  FEE_STRUCTURE,
  VALID_FEE_STRUCTURE,
  OPTIONS,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";

export const createUser = async (userData) => {
  const check = await User.findOneAndUpdate(
    {
      email: userData.email,
      isDeleted: false,
    },
    {
      $set: {
        email: userData.email,
      },
    },
    { upsert: true, new: true }
  );
  return check;
};
export const getFilter = async (type) => {
  const filter = await Filter.findOne({ isDeleted: false });
  if (type == "All") {
    const data = [
      {
        key: "projectType",
        value: filter.projectType,
      },
      {
        key: "AcceptVirtualConsultation",
        value: ["yes", "No"],
      },
      {
        key: "fullServiceClient",
        value: ["Yes", "No"],
      },
      {
        key: "destination",
        value: ["Yes", "No"],
      },
      {
        key: "styles",
        value: filter.style,
      },
      {
        key: "preferences",
        value: filter.preferences,
      },
      {
        key: "projectSize",
        value: filter.projectSize,
      },
    ];
    return data;
  }
  if (type == "Virtual") {
    const data = [
      {
        key: "projectSize",
        value: filter.projectSize,
      },
      {
        key: "dateRange",
        value: ["startDate", "endDate"],
      },
      {
        key: "consultationLength",
        value: ["25 mins", "55 mins"],
      },
      {
        key: "consultationFee",
        value: ["minimumPrice", "maximumPrice"],
      },
      {
        key: "goals",
        value: filter.goals,
      },
      {
        key: "styles",
        value: filter.style,
      },
      {
        key: "preferences",
        value: filter.preferences,
      },
    ];
    return data;
  }
  if (type == "Interior") {
    const data = [
      {
        key: "destination",
        value: ["Yes", "No"],
      },
      {
        key: "projectSize",
        value: filter.projectSize,
      },
      {
        key: "feeStructure",
        value: VALID_FEE_STRUCTURE,
      },
      {
        key: "consultationFee",
        value: ["minimumPrice", "maximumPrice"],
      },
      {
        key: "styles",
        value: filter.style,
      },
      {
        key: "preferences",
        value: filter.preferences,
      },
    ];
    return data;
  }
  if (type == "signUp") {
    const data = [
      {
        key: "projectSize",
        value: filter.projectSize,
      },
      {
        key: "projectType",
        value: filter.projectType,
      },
      {
        key: "goals",
        value: filter.goals,
      },
      {
        key: "destination",
        value: ["Yes", "No"],
      },
      {
        key: "goals",
        value: filter.goals,
      },
      {
        key: "preferences",
        value: filter.preferences,
      },
      {
        key: "styles",
        value: filter.style,
      },
      {
        key: "feeStructure",
        value: VALID_FEE_STRUCTURE,
      },
      {
        key: "tradeDiscount",
        value: ["Yes", "No"],
      },
      {
        key: "needHelp",
        value: filter.needHelp,
      },
      {
        key: "fullServiceClient",
        value: ["Yes", "No"],
      },
    ];
    return data;
  }
};
export const register = async (userData) => {
  console.log(userData);
  const check = await User.findOne({
    email: userData.email,
    //isVerify: true,
    type: userData.type,
    isDeleted: false,
  });
  console.log(check);
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  var user = await User.findOneAndUpdate(
    {
      email: userData.email,
      type: userData.type,
    },
    {
      $set: {
        email: userData.email,
        name: userData.name,
        password: await bcrypt.hash(userData.password, 8),
        type: userData.type,
      },
    },
    { upsert: true, new: true }
  );
  const value = user.toObject();
  await formatUser(value);
  return value;
};
export const profileEdit = async (data, userId, token) => {
  await editProfile(data.email, token, data.name);
  return;
};
export const getProfile = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
    // type: type,
    //isVerify: true,
  }).lean();

  if (user.type == "User") {
    formatVendor(user);
    return user;
  } else {
    formatUser(user);
    return user;
  }
};

export const profile = async (token, name, email) => {
  const check = await Token.findOne({ token: token, isDeleted: false }).lean();

  if (check) {
    const user = await User.findOne({
      _id: check.user,
      //isVerify: true,
      isDeleted: false,
    });
    if (user) {
      const data = await User.findOneAndUpdate(
        { _id: user._id, isDeleted: false },
        { email: email, name: name }
      );
      return data;
    }
  }
};
export const verifyEmails = async (token) => {
  const user = await Token.findOne({ token: token, isDeleted: false });
  const data = await User.findOneAndUpdate(
    { _id: user.user, isDeleted: false },
    { isVerify: true },
    { new: true }
  );
  return data;
};
export const createService = async (userId, data) => {
  const check = await User.findOne({
    _id: userId,
   // isVerify: true,
    isDeleted: false,
  });

  console.log(data.long,data.lat)
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
     // isVerify: true,
      isDeleted: false,
    },
    {
      companyName: data.companyName,
      location: {
        type: "Point",
        coordinates: [data.long, data.lat],
      },
      address: data.address,
      instagramLink: data.instagramLink,
      pinterestLink: data.pinterestLink,
      about: data.about,
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      feeStructure: data.feeStructure,
      tradeDiscount: data.tradeDiscount,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
      preferences: data.preferences,
      projectSize: data.projectSize,
      styles: data.styles,
      goals: data.goals,
      needHelp: data.needHelp,
      fullServiceClients: data.fullServiceClients,
      isSignUp: true,
    },
    { new: true }
  ).lean();
  await Request.create({
    sender: userId,
  });
  await formatUser(user);
  return user;
};
export const userLogin = async (data) => {
  let user = await User.findOne({
    email: data.email,
    type: data.type,
   // isVerify: true,
    isDeleted: false,
  }).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }

  if (user.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }
  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  await formatUser(user);

  return user;
};

export const userSocialLogin = async (data) => {
  const user = await User.findOneAndUpdate(
    {
      googleId: data.socialId,
      type: data.type,
      isDeleted: false,
    },
    {
      $setOnInsert: {
        name: data.name,
      },
      $set: { googleId: data.socialId, isVerify: true, type: data.type },
    },
    { upsert: true, new: true }
  );

  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return user;
};

export const userLogout = async (tokenId) => {
  const token = await Token.findOne({
    _id: tokenId,
    isDeleted: false,
  });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if (token.isDeleted) {
    throw new OperationalError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.LOG_OUT);
  }
  await Token.findByIdAndUpdate(
    { _id: tokenId },
    { isDeleted: true },
    { new: true }
  );
  return;
};

export const resetPassword = async (tokenData, newPassword) => {
  let query = tokenData.user;
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.USER) {
    const userdata = await User.findOneAndUpdate(
      { _id: query },
      { $set: { password: newPassword } }
    );
    console.log(userdata);
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
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).lean();
  console.log(user)
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OLD_PASSWORD
    );
  }
  let updatedPassword = { password: newPassword };
  Object.assign(user, updatedPassword);
  await user.save();
  return user;
};
