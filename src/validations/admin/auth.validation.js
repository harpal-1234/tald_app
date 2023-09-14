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
export default {
  adminLogin,
  getUsers,
  requestAction,
  userAction,
  createInteriorDesigner,
};
