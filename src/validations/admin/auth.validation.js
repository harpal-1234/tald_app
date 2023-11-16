import Joi from "joi";
import { JOI } from "../../config/appConstants.js";
import {
  PROJECT_SIZE,
  PROJECT_TYPE,
  PREFERENCES,
  OPTIONS,
  FEE_STRUCTURE,
  STYLE,
  GOALS,
} from "../../config/appConstants.js";

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};
const getUsers = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().required().allow(null, ""),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    oldPassword: JOI.PASSWORD,
    newPassword: JOI.PASSWORD,
  }),
};
const requestAction = {
  body: Joi.object().keys({
    status: Joi.boolean().required().valid(true, false),
    requestId: Joi.string().required(),
  }),
};
const userAction = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
const createInteriorDesigner = {
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
    minBudget: Joi.number().required().allow(null),
    maxBudget: Joi.number().required().allow(null),
  }),
};
const register = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    name: Joi.string().required(),
  }),
};
const filterData = {
  body: Joi.object().keys({
    style: Joi.array().required(),
    preferences: Joi.array().required(),
    projectSize: Joi.array().required(),
    needHelp: Joi.array().required(),
    feeStructure: Joi.array().required(),
    goals: Joi.array().required(),
    projectType: Joi.array().required(),
    consultationLength: Joi.array().required(),
  }),
};
export const dashboard = {
  query: Joi.object().keys({
    startDate: Joi.string().required().allow(null, ""),
    endDate: Joi.string().required().allow(null, ""),
  }),
};
export const getConsultation = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const iqueryOnAction = {
  body: Joi.object().keys({
    Id: Joi.string().required(),
    status: Joi.string().required().valid("Accept", "Reject"),
  }),
};

export default {
  adminLogin,
  getUsers,
  requestAction,
  userAction,
  createInteriorDesigner,
  changePassword,
  register,
  filterData,
  dashboard,
  getConsultation,
  iqueryOnAction
};
