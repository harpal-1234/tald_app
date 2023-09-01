//import { valid } from "joi";
import Joi from "joi";
import {
  PROJECT_TYPE,
  FEE_STRUCTURE,
  OPTIONS,
  DAYS,
  PREFERENCES,
  GOALS,
  PROJECT_SIZE,
  STYLE,
} from "../../config/appConstants.js";
import { Types } from "mongoose";

export const createProject = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
  }),
};
export const getInteriorDesigner = {
  query: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid("All", "VirtualConsultation", "InteriorDesigner")
      .allow(null, ""),
    lat: Joi.number().required().allow(null, ""),
    long: Joi.number().required().allow(null, ""),
    projectType: Joi.string()
      .required()
      .valid(...Object.values(PROJECT_TYPE))
      .allow(null, ""),
    destination: Joi.string()
      .required()
      .valid(...Object.values(OPTIONS))
      .allow(null, ""),
    consultationLength: Joi.string()
      .required()
      .valid("25 mins", "55 mins")
      .allow(null, ""),
    minimumPrice: Joi.number().required().allow(null, ""),
    maximumPrice: Joi.number().required().allow(null, ""),
    // preferences: Joi.array()
    //   .required()
    //   .items(Joi.string().required().valid(...Object.values(PREFERENCES)))
    //   .allow(null, ""),
    // styles: Joi.array()
    //   .required()
    //   .items(
    //     Joi.string()
    //       .required()
    //       .valid(...Object.values(STYLE))
    //   )
    //   .allow(null, ""),
    // goals: Joi.array()
    //   .required()
    //   .items(
    //     Joi.string()
    //       .required()
    //       .valid(...Object.values(GOALS))
    //   )
    //   .allow(null, ""),
    // projectSize: Joi.string()
    //   .required()
    //   .valid(...Object.values(PROJECT_SIZE))
    //   .allow(null, ""),
  }),
};
export const addImages = {
  body: Joi.object().keys({
    projectId: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object({
          image: Joi.string().required(),
        })
      )
      .required(),
  }),
};
export const deleteProjectImages = {
  body: Joi.object().keys({
    imageIds: Joi.array().required(),
    projectId: Joi.string().required(),
  }),
};
export const addAvailability = {
  body: Joi.object().keys({
    weeklySchedule: Joi.array()
      .items(
        Joi.object({
          day: Joi.string()
            .required()
            .valid(...Object.values(DAYS))
            .allow(null, ""),
          startTime: Joi.string().required().allow(null, ""),
          endTime: Joi.string().required().allow(null, ""),
          status: Joi.boolean().required(),
        })
      )
      .required(),
    availability: Joi.object({
      startDate: Joi.string(),
      numberOfDays: Joi.number(),
    }).required(),
    isIndefinitely: Joi.boolean().required(),
    inviteesSchedule: Joi.number().required(),
  }),
};
export const editProject = {
  body: Joi.object().keys({
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
      chargers_25_mins: Joi.string().required().allow(null, ""),
      chargers_55_mins: Joi.string().required().allow(null, ""),
    }),
    destinationProject: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string().required().allow(null, ""),
      chargers_55_mins: Joi.string().required().allow(null, ""),
    }),
    minBudget: Joi.number().required().allow(null),
    maxBudget: Joi.number().required().allow(null),
  }),
};
export const editCompanyDetails = {
  body: Joi.object().keys({
    companyName: Joi.string().required().allow("", null),
    lat: Joi.number().required().allow("", null),
    long: Joi.number().required().allow("", null),
    address: Joi.string().required().allow("", null),
    instagramLink: Joi.string().required().allow("", null),
    pinterestLink: Joi.string().required().allow("", null),
    about: Joi.string().required().allow("", null),
  }),
};
export const feeStructure = {
  body: Joi.object().keys({
    feeStructure: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(FEE_STRUCTURE)),
    }),
    tradeDiscount: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
    }),
  }),
};
export const editVendorProfile = {
  body: Joi.object().keys({
    companyName: Joi.string().required().allow("", null),
    lat: Joi.number().required().allow("", null),
    long: Joi.number().required().allow("", null),
    address: Joi.string().required().allow("", null),
    instagramLink: Joi.string().required().allow("", null),
    pinterestLink: Joi.string().required().allow("", null),
    about: Joi.string().required().allow("", null),
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
      chargers_25_mins: Joi.string().required().allow(null, ""),
      chargers_55_mins: Joi.string().required().allow(null, ""),
    }),
    destinationProject: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
      chargers_25_mins: Joi.string().required().allow(null, ""),
      chargers_55_mins: Joi.string().required().allow(null, ""),
    }),
    minBudget: Joi.number().required().allow(null),
    maxBudget: Joi.number().required().allow(null),
    feeStructure: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(FEE_STRUCTURE)),
    }),
    tradeDiscount: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string().valid(...Object.values(OPTIONS)),
    }),
  }),
};
