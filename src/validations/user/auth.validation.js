const { valid } = require("joi");
const Joi = require("joi");
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

exports.login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password: Joi.string().min(6).required(),
    type: Joi.string().required().valid("User", "Vendor"),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};
exports.logOut = {
  body: Joi.object().keys({
    type: Joi.string().required().valid("User", "Vendor"),
    // deviceToken:Joi.string().required(),
    // deviceType:Joi.string().valid(...Object.values(DEVICE_TYPE)),
  }),
};

exports.userSocialLogin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    socialId: Joi.string().required(),
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
exports.verifyOtp = {
  query: Joi.object().keys({
    otp: Joi.string().required(),
    // userType: Joi.string().required(),
  }),
};

exports.sendOtp = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    // userType: Joi.string().required(),
  }),
};

exports.signUp = {
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
    phoneNumber: JOI.PHONENUMBER,
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

exports.forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    // userType: Joi.string().required(),
  }),
};

exports.forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.resetForgotPassword = {
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

exports.changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),
};
exports.editprofile = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    password: Joi.string(),
    lastName: Joi.string(),
    profileImage: Joi.string(),
    phoneNumber: Joi.string()
      .max(10)
      .min(10)
      .message("Please enter a valid phone number"),
  }),
};

exports.pushNotificationStatus = {
  body: Joi.object().keys({
    pushNotification: Joi.string().valid(
      ...Object.values(PUSH_NOTIFICATION_STATUS)
    ),
  }),
};
