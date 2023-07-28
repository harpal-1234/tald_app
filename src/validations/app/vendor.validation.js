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
