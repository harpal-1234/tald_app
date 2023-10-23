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
  KIND_OF_ASSITANCE,
  STATUS,
  NEED_HELP,
} from "../../config/appConstants.js";
import { STATES, Types } from "mongoose";

export const createProject = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
  }),
};
export const seeProject = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const getInteriorDesignerById = {
  query: Joi.object().keys({
    designerId: Joi.string().required(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const saveProfile = {
  body: Joi.object().keys({
    designerId: Joi.string().required(),
  }),
};
export const getSaveProfile = {
  body: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const getSlots = {
  query: Joi.object().keys({
    designerId: Joi.string().required(),
    date: Joi.string().required(),
    timeDuration: Joi.string().required().valid("25_mins", "55_mins"),
  }),
};
export const bookConsultations = {
  body: Joi.object().keys({
    designerId: Joi.string().required(),
    timeSlots: Joi.array().required(),
    projectSummary: Joi.string().required().allow(null, ""),
    files: Joi.array().items(
      Joi.object({
        file: Joi.string().required(),
        fileType: Joi.string().required(),
      })
    ),
    durationTime: Joi.string().required().valid("25_mins", "55_mins"),
  }),
};
export const addFileConsultation = {
  body: Joi.object().keys({
    consultationId: Joi.string().required(),
    file: Joi.string().required(),
    fileType: Joi.string().required(),
  }),
};
export const getInteriorDesigner = {
  query: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid("All", "VirtualConsultation", "InteriorDesigner")
      .allow(null, ""),
    lat: Joi.number().allow(null, ""),
    long: Joi.number().allow(null, ""),
    projectType: Joi.string()
      .valid(...Object.values(PROJECT_TYPE))
      .allow(null, ""),
    destination: Joi.string()
      .valid(...Object.values(OPTIONS))
      .allow(null, ""),
    consultationLength: Joi.string()
      .valid("25 mins", "55 mins")
      .allow(null, ""),
    // .required()
    minimumPrice: Joi.number().allow(null, ""),
    maximumPrice: Joi.number().allow(null, ""),
    preferences: Joi.string(),
    // Joi.array()
    //   .items(
    //     Joi.string()
    //       .required()
    //       .valid(...Object.values(PREFERENCES))
    //   )
    //   .allow(null, ""),
    styles: Joi.string(),
    // Joi.array()
    //   .items(
    //     Joi.string()
    //       .required()
    //       .valid(...Object.values(STYLE))
    //   )
    //   .allow(null, ""),
    goals: Joi.string(),
    // Joi.array()
    //   .items(
    //     Joi.string()
    //       .required()
    //       .valid(...Object.values(GOALS))
    //   )
    //   .allow(null, ""),
    projectSize: Joi.string()
      .valid(...Object.values(PROJECT_SIZE))
      .allow(null, ""),
    needHelp: Joi.string(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
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
      startDate: Joi.string().allow(null, ""),
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
export const getConsultations = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const createProjectInquery = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
    //designer: Joi.string().required(),
    projectType: Joi.string()
      .valid(...Object.values(PROJECT_TYPE))
      .allow(null, ""),
    kindOfAssistance: Joi.string()
      .required()
      .valid(...Object.values(KIND_OF_ASSITANCE)),
    projectSummary: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    projectFund: Joi.number().required(),
    primaryDecisionMaker: Joi.string()
      .required()
      .valid(...Object.values(OPTIONS)),
    workedWithInteriorDesigner: Joi.string()
      .required()
      .valid(...Object.values(OPTIONS)),
    involvedYourProject: Joi.string().required(),
    files: Joi.array().items(
      Joi.object({
        file: Joi.string().required(),
        fileType: Joi.string().required(),
      })
    ),
  }),
};
export const editProjectInquery = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
    projectId: Joi.string().required(),
    projectType: Joi.string()
      .valid(...Object.values(PROJECT_TYPE))
      .allow(null, ""),
    kindOfAssistance: Joi.string()
      .required()
      .valid(...Object.values(KIND_OF_ASSITANCE)),
    projectSummary: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    projectFund: Joi.number().required(),
    primaryDecisionMaker: Joi.string()
      .required()
      .valid(...Object.values(OPTIONS)),
    workedWithInteriorDesigner: Joi.string()
      .required()
      .valid(...Object.values(OPTIONS)),
    involvedYourProject: Joi.string().required(),
    files: Joi.array().items(
      Joi.object({
        file: Joi.string().required(),
        fileType: Joi.string().required(),
      })
    ),
  }),
};
export const submitProjectInquery = {
  body: Joi.object().keys({
    projectId: Joi.string().required(),
    designerId: Joi.string().required(),
  }),
};
export const getInqueryStatus = {
  query: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};
export const consultationAction = {
  body: Joi.object().keys({
    consultationId: Joi.string().required(),
    confirmTime: Joi.string().required(),
  }),
};
export const getConversations = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const getChat = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    conversationId: Joi.string().required(),
  }),
};
export const deleteChat = {
  body: Joi.object().keys({
    conversationId: Joi.string().required(),
  }),
};
export const blockUser = {
  body: Joi.object().keys({
    conversationId: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};
export const getProjectInqueries = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export const actionProjectQuery = {
  body: Joi.object().keys({
    Id: Joi.string().required(),
    status: Joi.string().required().valid(STATUS.ACCEPTED, STATUS.REJECTED),
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
    companyName: Joi.string().allow("", null),
    lat: Joi.number().allow("", null),
    long: Joi.number().allow("", null),
    address: Joi.string().allow("", null),
    instagramLink: Joi.string().allow("", null),
    pinterestLink: Joi.string().allow("", null),
    about: Joi.string().allow("", null),
    projectType: Joi.object({
      question: Joi.string().allow(null, "").required(),
      answer: Joi.string()
        .valid(...Object.values(PROJECT_TYPE))
        .required(),
    }),
    virtual_Consultations: Joi.object({
      question: Joi.string().allow(null, "").required(),
      answer: Joi.string()
        .valid(...Object.values(OPTIONS))
        .required(),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }),
    newClientProjects: Joi.object({
      question: Joi.string().allow(null, "").required(),
      answer: Joi.string()
        .valid(...Object.values(OPTIONS))
        .required(),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }),
    destinationProject: Joi.object({
      question: Joi.string().allow(null, "").required(),
      answer: Joi.string()
        .valid(...Object.values(OPTIONS))
        .required(),
      chargers_25_mins: Joi.string().allow(null, ""),
      chargers_55_mins: Joi.string().allow(null, ""),
    }),
    minBudget: Joi.number().allow(null),
    maxBudget: Joi.number().allow(null),
    feeStructure: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string()
        .valid(...Object.values(FEE_STRUCTURE))
        .required(),
    }),
    tradeDiscount: Joi.object({
      question: Joi.string().required().allow(null, ""),
      answer: Joi.string()
        .valid(...Object.values(OPTIONS))
        .required(),
    }),
    preferences: Joi.array()
      // .required()
      .items(Joi.string().valid(...Object.values(PREFERENCES))),
    styles: Joi.array()
      // .required()
      .items(
        Joi.string()
          .required()
          .valid(...Object.values(STYLE))
      ),
    goals: Joi.array()
      // .required()
      .items(
        Joi.string()
          .required()
          .valid(...Object.values(GOALS))
      ),
    needHelp: Joi.array().items(
      Joi.string().valid(...Object.values(NEED_HELP))
    ),
    projectSize: Joi.string()
      // .required()
      .valid(...Object.values(PROJECT_SIZE)),
  }),
};
