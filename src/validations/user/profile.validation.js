import { valid } from "joi";
import Joi from "joi";
const {
  JOI,
  USER_TYPE,
  WORK_TYPE,
  SOCIAL_LOGIN,
  PUSH_NOTIFICATION_STATUS,
  VALIDPRONOUN,
  VALID_DRUGS,
  VALID_HOBBIES_AND_INTRESTS,
  VALID_LIFE_STYLE,
  VALID_LOOKIN_FOR,
  VALID_PETS,
  VALID_POLITICALS_VIEWS,
  VALID_PREFERANCES,
  VALID_SIGN,
  VALID_GENDER,
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
    //phoneNumber: JOI.PHONENUMBER,
    profession: Joi.string().required(),
    bio: Joi.string().required(),
    dateOfBirth:Joi.string().required(),
    pronoun: Joi.string()
      .required()
      .valid(...VALIDPRONOUN),
    politicalViews: Joi.string()
      .required()
      .valid(...VALID_POLITICALS_VIEWS),
    sign: Joi.string()
      .required()
      .valid(...VALID_SIGN),
    genderIdentity: Joi.string()
      .required()
      .valid(...VALID_GENDER),
    prefrences: Joi.array().items(Joi.string().valid(...VALID_PREFERANCES)),
    lifeStyles: Joi.array().items(Joi.string().valid(...VALID_LIFE_STYLE)),
    drugUsages: Joi.array().items(Joi.string().valid(...VALID_DRUGS)),
    hobbiesAndInterests: Joi.array().items(
      Joi.string().valid(...VALID_HOBBIES_AND_INTRESTS)
    ),
    pets: Joi.array().items(Joi.string().valid(...VALID_PETS)),
    lookingFor: Joi.array().items(Joi.string().valid(...VALID_LOOKIN_FOR)),
    //type:Joi.string().required().valid("User", "Vendor"),
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