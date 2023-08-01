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
  DAYS,
} from "../../config/appConstants.js";

export const createProject = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
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
