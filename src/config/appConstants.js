const Joi = require("joi");
const { objectId } = require("../validations/custom.validation");

const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "resetPassword",
};

const USER_TYPE = {
  ADMIN: "Admin",
  USER: "User",
  VENDOR_ADMIN: "Vendor",
};

const DEVICE_TYPE = {
  IOS: "Ios",
  ANDROID: "Android",
  WEB: "Web",
};

const BANNER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const DEALS_SERVICE = {
  RESTAURANTS: "Restaurants",
  BARS: "Bars",
  CANNABIS: "Cannabis",
  NIGHTLIFE: "Nightlife",
  SHOPPING: "Shopping",
  BEAUTY_SPA: "Beauty & Spas",
  ARTS_ENTERTAINMENT: "Arts & Entertainment",
  ACTIVE_LIFE: "Active Life",
  AUTOMOTIVE: "Automotive",
  HOTELS: "Hotels",
  BABY_KIDS: "Baby & Kids",
  PETS: "Pets",
  SPORTS_FITNESS: "Sports & Fitness",
  ELECTRONICS: "Electronics",
  WOMEN_CLOTHHING: "Women's Clothing",
  MEN_CLOTHING: "Mens Clothing",
};

const PUSH_NOTIFICATION_STATUS = {
  ENABLE: "Enable",
  DISABLE: "Disable",
};

const NOTIFICATION_STATUS = {
  ENABLE: "Enable",
  DISABLE: "Disable",
};

const JOI = {
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(6).required(),
  PHONENUMBER: Joi.string()
    .max(10)
    .min(10)
    .message("Please enter a valid phone number"),
  LIMIT: Joi.number().default(10),
  PAGE: Joi.number().default(0),
  OBJECTID: Joi.string().custom(objectId).required(),
  DEVICE_TYPE: Joi.string()
    .valid(...Object.values(DEVICE_TYPE))
    .required(),
  USER_TYPE: Joi.string().valid(USER_TYPE.USER, USER_TYPE.ADMIN).required(),
};

const SKILL_LEVEL = {
  BASIC: 0,
  ASTUTE: 1,
  EXPERT: 2,
};

const WORK_LOCATION = {
  REMOTE: "remote",
  WORk_LOCATION: "work",
};

const ASSIGNMENT_STATUS = {
  DRAFT: "draft",
  PROPOSED: "proposed",
  IN_PROCESS: "inProcess",
  COMPLETED: "completed",
};

const REQUEST_STATUS = {
  RECEIVED: "received",
  PROPOSED: "proposed",
  REJECDED: "rejected",
};

const SUCCESS_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "Your are successfully logged out",
  USER_SUCCESS: "User Created successfully",
  USER_PASSWORD: "Password changed successfully",
  CONTACT_US: "Report sent successfully",
  USER_LOCATION: "Location Updated Successfully",
  BANNER_REQUEST: "Request Sent Successfully",
  BANNER_DATA: "All Bannner Request",
  BANNER_STATUS: "Banner Request Accepted ",
  VENDOR_ADMIN: "User created Successfully",
  ALL_USER: "All User Details",
  NOTIFICATION_STATUS: "Notification Created Sucessfully",
  NOTIFICATION_DETAILS: "ALl Notification Details",
  FAVOURITES_DEALS: "User Favourite Deal stores",
  CATEGORY_ADDED:'Category Added Sucessfully',
  CATEGORY_DATA:'All Category',
  STORE_DATA:'All Store Data',
  FAVORITE_DATA:'Deal Added To Your Favourites',
  STORE_DEALS:'Store All Deals'
};

const UPDATED_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "Your are successfully logged out",
  USER_SUCCESS: "User Created successfully",
  USER_PASSWORD: "Password changed successfully",
  CONTACT_US: "Report sent successfully",
  USER_LOCATION: "Location Updated Successfully",
  NOTIFICATION_EDITED: "Notification Upadted Successfully",
  USER_UPDATED: "User Profile Updated Sucessfully",
};

const ERROR_MESSAGES = {
  USER_CREDENTIAL: "Pease Check Your Parameter",
  NOT_FOUND: "Not found",
  VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
  SERVER_ERROR: "Something went wrong, Please try again.",
  AUTHENTICATION_FAILED: "Please authenticate",
  UNAUTHORIZED: "You are not authorized to perform this action",
  EMAIL_ALREADY_EXIST: "This email already exist. Please try with other email",
  EMAIL_NOT_FOUND: "Email not found",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  WRONG_PASSWORD: "Password is Incorrect",
  ACCOUNT_DELETED: "Your account has been deleted by Admin",
  ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
  USER_NOT_FOUND: "User not found",
  SKILL_ALREADY_EXIST: "Skill already exist with this name.",
  WRONG_PASSWORD: "Password is Incorrect",
  COUPON_CODE: "Please Provide Different Coupon Code",
  COUPON_DATA: "Coupon not exist",
  COUPON_WEBLINK: "Coupon Already exist",
  STORE_NOT_EXIST: "Store not exists",
  NOTIFICATION_DATA: "Notification Not Exists",
  DEAL_NOT_EXISTS:"Deal not Exists",
  BANNER_NOT_EXISTS:'Banner not exists',
  CATEGORY_ALREADY_EXISTS:'Category Already Exists',
  CATEGORY_NOT_EXISTS:'Category Not Exists',
  USER_ALREADY_EXIST:'User Already Exists'

};

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACTION_PENDING: 202,
  ACTION_COMPLETE: 204,

  VALIDATION_FAILED: 400,
  ACTION_FAILED: 400,
  AUTH_FAILED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const socialMedia = {
  TRUE: "true",
  FALSE: "false",
};
const SOCIAL_LOGIN = {
  GOOGLEID: "GoogleId",
  FACEBOOKID: "FacebookId",
  APPLEID: "AppleId",
};

const DELETE_MASSAGES = {
  USER_DELETED: "User Deleted Successfully",
  COUPON_DELETED: "Coupon Deleted Successfully",
  BANNER_DELETED: "Banner Deleted Successfully",
  STORE_DELETED: "Store Deleted Sucessfully",
  NOTIFICATION_DELETED: "Notification Deleted Successfully",
  ADMIN_DELETED_VENDOR: "Admin Deleted Vendor",
  ADMIN_DELETED_USER: "Admin Deleted User",
  CATEGORY_DELETED:'Category Deleted Successfully'
};

module.exports = {
  BANNER_STATUS,
  PUSH_NOTIFICATION_STATUS,
  NOTIFICATION_STATUS,
  DEALS_SERVICE,
  DELETE_MASSAGES,
  TOKEN_TYPE,
  USER_TYPE,
  JOI,
  DEVICE_TYPE,
  SKILL_LEVEL,
  WORK_LOCATION,
  ASSIGNMENT_STATUS,
  REQUEST_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STATUS_CODES,
  UPDATED_MESSAGES,
  SOCIAL_LOGIN
};



// SPA: "spa",
  // FOOD: "food",
  // FOOTWEAR: "footwear",
  // CLOTHING: "clothing",
  // CANNABIS: "cannabis",
  // BUFFET: "buffet",
  // SALON: "salon",
  // HEATH: "heath",
  // ACTIVITY: "activity",