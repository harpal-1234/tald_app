//import { valid } from "joi";
import Joi from "joi";
import {
  JOI,
  USER_TYPE,
  PROJECT_TYPE,
  FEE_STRUCTURE,
  OPTIONS,
  SOCIAL_LOGIN,
  SOCIAL_TYPE,
} from "../../config/appConstants.js";

const login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password: Joi.string().min(6).required(),
    type: Joi.string().required().valid("User", "Vendor"),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const logOut = {
  body: Joi.object().keys({
    type: Joi.string().required().valid("User", "Vendor"),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const createServices = {
  body: Joi.object().keys({
    companyName: Joi.string(),
    // location: Joi.object({
    //   type: Joi.string().default("Point"),
    //   coordinates: Joi.array().items(Joi.number()).length(2).required(),
    // }),
    lat: Joi.number(),
    long: Joi.number(),
    address: Joi.string(),
    instagramLink: Joi.string(),
    pinterestLink: Joi.string(),
    about: Joi.string(),
    projectType: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(PROJECT_TYPE)),
    }),
    virtual_Consultations: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string(),
      chargers_55_mins: Joi.string(),
    }),
    newClientProjects: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string(),
      chargers_55_mins: Joi.string(),
    }),
    destinationProject: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string(),
      chargers_55_mins: Joi.string(),
    }),
    feeStructure: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(FEE_STRUCTURE)),
    }),
    tradeDiscount: Joi.object({
      question: Joi.string(),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
    }),
    minBudget: Joi.string(),
    maxBudget: Joi.string(),
  }),
};
const userSocialLogin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    socialId: Joi.string().required(),
    email: Joi.string().required().allow(null, ""),
    // socialType: Joi.string()
    //   .required()
    //   .valid(...Object.values(SOCIAL_TYPE)),
    //phoneNumber: JOI.PHONENUMBER,
    //profession: Joi.string().required(),
    //bio: Joi.string().required(),
    //pronoun: Joi.string()
    // .required()
    // .valid(...VALIDPRONOUN),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
const verifyOtp = {
  query: Joi.object().keys({
    otp: Joi.string().required(),
    // userType: Joi.string().required(),
  }),
};

const sendOtp = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    // userType: Joi.string().required(),
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
    type: Joi.string().required().allow(USER_TYPE),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    type: Joi.string().required().allow("Vendor", "User"),
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
export default {
  signUp,
  pushNotificationStatus,
  editprofile,
  changePassword,
  resetForgotPassword,
  forgotPage,
  forgotPassword,
  sendOtp,
  verifyOtp,
  userSocialLogin,
  logOut,
  login,
  contactUs,
  register,
  createServices,
};
