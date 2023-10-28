//import { valid } from "joi";
import Joi from "joi";
import {
  JOI,
  USER_TYPE,
  PROJECT_TYPE,
  FEE_STRUCTURE,
  OPTIONS,
  USERTYPE1,
  SOCIAL_TYPE,
  PREFERENCES,
  STYLE,
  GOALS,
  PROJECT_SIZE,
  NEED_HELP
} from "../../config/appConstants.js";

const login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password: Joi.string().min(6).required(),
    type: Joi.string()
      .required()
      .valid(...Object.values(USERTYPE1)),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const logOut = {
  body: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid(...Object.values(USERTYPE1)),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const createServices = {
  body: Joi.object().keys({
    companyName: Joi.string(),
    lat: Joi.number(),
    long: Joi.number(),
    address: Joi.string(),
    instagramLink: Joi.string(),
    pinterestLink: Joi.string(),
    about: Joi.string(),
    projectType: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(PROJECT_TYPE)),
    }).required(),
    virtual_Consultations: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }).required(),
    newClientProjects: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }).required(),
    destinationProject: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }).required(),
    feeStructure: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(FEE_STRUCTURE)),
    }),
    tradeDiscount: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
    }),
    preferences: Joi.array()
      .required()
      .items(Joi.string().valid(...Object.values(PREFERENCES))),
    styles: Joi.array()
      .required()
      .items(
        Joi.string()
          .required()
          .valid(...Object.values(STYLE))
      ),
    goals: Joi.array()
      .required()
      .items(
        Joi.string()
          .required()
          .valid(...Object.values(GOALS))
      ),
    projectSize: Joi.string()
      .required()
      .valid(...Object.values(PROJECT_SIZE)),
    needHelp: Joi.array()
      .required()
      .items(Joi.string().valid(...Object.values(NEED_HELP))),
    fullServiceClients: Joi.string().required().valid(...Object.values(OPTIONS)),
    minBudget: Joi.number().required().allow(null),
    maxBudget: Joi.number().required().allow(null),
  }),
};
const userSocialLogin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    socialId: Joi.string().required(),
    email: Joi.string().required().allow(null, ""),
    type: Joi.string().required().valid("Vendor", "User"),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const signUp = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
  }),
};
const register = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    name: Joi.string().required(),
    password: JOI.PASSWORD,
    type: Joi.string()
      .required()
      .allow(...Object.values(USERTYPE1)),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    type: Joi.string()
      .required()
      .allow(...Object.values(USERTYPE1)),
  }),
};

const forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetForgotPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Password does not match" }),
  }),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),
};
const editprofile = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    name: Joi.string().required().allow(null, ""),
    email: Joi.string().required().allow(null, ""),
  }),
};
const verifyProfile = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    name: Joi.string().required().allow(null, ""),
    email: JOI.EMAIL,
  }),
};
const pushNotificationStatus = {
  body: Joi.object().keys({
    pushNotification: Joi.string(),
  }),
};
const contactUs = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    message: Joi.string().required(),
  }),
};
const editProfile = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    name: Joi.string().required(),
  }),
};
const filters = {
  query: Joi.object().keys({
    type: Joi.string().required().valid("All","Virtual","Interior","signUp"),
  }),
};
const getProfile = {
  query: Joi.object().keys({
    type: Joi.string().required().valid("User","Vendor"),
  }),
};
const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
export default {
  signUp,
  pushNotificationStatus,
  editprofile,
  changePassword,
  resetForgotPassword,
  forgotPage,
  forgotPassword,
  userSocialLogin,
  logOut,
  login,
  contactUs,
  register,
  createServices,
  editProfile,
  verifyProfile,
  verifyEmail,
  getProfile,
  filters,
};
