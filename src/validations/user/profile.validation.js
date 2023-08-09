import { valid } from "joi";
import Joi from "joi";
const {
  JOI,
  USER_TYPE,
  WORK_TYPE,
} = require("../../config/appConstants");

const  editprofile = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    images: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().required(),
      })
    ),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    address: Joi.string().required(),
    dateOfBirth:Joi.string().required(),
    profession: Joi.string().required(),
    bio: Joi.string().required(),
    dateOfBirth:Joi.string().required(),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};

const userContactUs = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phoneNumber: JOI.PHONENUMBER,
    message: Joi.string().required()
  }),
};

const userLocation = {
  body: Joi.object().keys({
    location: Joi.string(),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    oldPassword:JOI.PASSWORD,
    newPassword:JOI.PASSWORD,
  }),
};
const favouriteStoreDeal = {
  query: Joi.object().keys({
    storeId: Joi.string().required(),
  }),
};

export default{
  favouriteStoreDeal,
  changePassword,
  userLocation,
  userContactUs,
  editprofile
}