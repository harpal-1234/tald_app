import Joi from "joi";
import { objectId } from "../validations/custom.validation.js";

export const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "resetPassword",
};

export const USER_TYPE = {
  ADMIN: "Admin",
  USER: "User",
  VENDOR_ADMIN: "Vendor",
};
export const BUSINESS = {
  BAR: "Bar",
  CLUB: "Club",
  COMEDY_CLUB: "Comedy Club",
  SPORTS_BAR: "Sports Bar",
  EVENT_PROMOTER: "Event Promoter",
  RESTARURANT: "Restaurant",                               
  BREWERY: "Brewery",
  FESTIVAL: "Festival",
  SPEAKEASY: "Speakeasy",
  OTHER: "Other",
};
export const VALID_BUSINESS = [
  "Bar",
  "Club",
  "Comedy Club",
  "Sports Bar",
  "Event Promoter",
  "Restaurant",
  "Brewery",
  "Festival",
  "Speakeasy",
  "Other",
];
export const DAYS ={
  MONDAY:"Monday",
  TUESDAY:"Tuesday",
  WEDNESDAY:"Wednesday",
  THURSDAY:"Thursday",
  FRIDAY:"Friday",
  SATURDAY:"Saturday",
  SUNDAY:"Sunday"
}
// export const SOCIAL_TYPE = {
//   FACEBOOK: "facebook",
//   APPLE: "apple",
//   GOOGLE: "google",
// };
export const DEVICE_TYPE = {
  IOS: "Ios",
  ANDROID: "Android",
  WEB: "Web",
};
const PUSH_NOTIFICATION_STATUS = {
  ENABLE: "Enable",
  DISABLE: "Disable",
};
const PLAN = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  ANUALY: "Anualy",
};
const NOTIFICATION_STATUS = {
  ENABLE: "Enable",
  DISABLE: "Disable",
};
export const JOI = {
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(6).required(),
  PHONENUMBER: Joi.string()
    .max(15)
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
const DISTANCE = {
  KM: "Km",
  MILES: "Miles",
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

export const SUCCESS_MESSAGES = {
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
  CATEGORY_ADDED: "Category Added Sucessfully",
  CATEGORY_DATA: "All Category",
  STORE_DATA: "All Store Data",
  FAVORITE_DATA: "Store Added To Your Favourites",
  FAVORITE_DATA_REMOVE: "Store remove To Your Favourites",
  STORE_DEALS: "Store All Deals",
  PUSH_NOTIFICATION_STATUS: "Push notification status updated",
  ALL_CATEGORY: "All category Details",
  SEND_OTP: "Otp sent on your phoneNumber sucessfully",
};

export const UPDATED_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "Your are successfully logged out",
  USER_SUCCESS: "User Created successfully",
  USER_PASSWORD: "Password changed successfully",
  CONTACT_US: "Report sent successfully",
  USER_LOCATION: "Location Updated Successfully",
  NOTIFICATION_EDITED: "Notification Upadted Successfully",
  USER_UPDATED: "User Profile Updated Sucessfully",
  DEAL_UPDATED: "Deal Updated Successfully",
};

export const ERROR_MESSAGES = {
  USER_CREDENTIAL: "Pease Check Your Parameter",
  NOT_FOUND: "Not found",
  VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
  SERVER_ERROR: "Something went wrong, Please try again.",
  AUTHENTICATION_FAILED: "Please authenticate",
  UNAUTHORIZED: "You are not authorized to perform this action",
  EMAIL_ALREADY_EXIST: "This email already exist. Please try with other email",
  EMAIL_NOT_FOUND: "Email not found, please signUp",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  WRONG_PASSWORD: "Password is Incorrect",
  ACCOUNT_DELETED: "Your account has been deleted by Admin",
  ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
  USER_NOT_FOUND: "User not found",
  SKILL_ALREADY_EXIST: "Skill already exist with this name.",
  WRONG_PASSWORD: "Password is Incorrect",
  DEAL_ID: "This deal allready exist",
  COUPON_DATA: "store not exist",
  COUPON_WEBLINK: "Coupon Already exist",
  STORE_NOT_EXIST: "Store not exists",
  NOTIFICATION_DATA: "Notification Not Exists",
  DEAL_NOT_EXISTS: "Deal not Exists",
  BANNER_NOT_EXISTS: "Banner not exists",
  CATEGORY_ALREADY_EXISTS: "Category Already Exists",
  CATEGORY_NOT_EXISTS: "Category Not Exists",
  USER_ALREADY_EXIST: "User Already Exists",
  CONTACTUS_EMAIL_USER: "Please enter your registered email",
  BANNER_ID: "Please provide different banner Id",
  VENDOR_NOT_EXIST: "Vendor does not exist",
  FCM_ERROR: "fcm error",
  ORDER_NOT_FOUND: "Order not found",
  OTP_EXPIRE: "This verification code has expired. please try again",
  VERIFY_UNMATCH: "This verify code dose not match .please try again",
  PHONE_ALREADY_EXIST: "This phoneNumber allready exist",
  PHONE_NOT_MATCH: "This phone does not match ",
  PHONE_NOT_EXIST: "This phone number not exist please signUp",
  DOES_NOT_EXIST: "Data does not exist",
  LIMIT: "You have exhausted your daily limit for swiping",
  UPGRATE: "Please upgrate your account",
  GROUP_NOT_EXIST: "This group does not exist",
};
export const SOCIAL_TYPE = {
  FACEBOOK: "facebook",
  APPLE: "apple",
  GOOGLE: "google",
};
export const STATUS_CODES = {
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

export const SOCIAL_LOGIN = {
  GOOGLEID: "GoogleId",
  FACEBOOKID: "FacebookId",
  APPLEID: "AppleId",
};

export const DELETE_MASSAGES = {
  USER_DELETED: "User Deleted Successfully",
  COUPON_DELETED: "Deal Deleted Successfully",
  BANNER_DELETED: "Banner Deleted Successfully",
  STORE_DELETED: "Store Deleted Sucessfully",
  NOTIFICATION_DELETED: "Notification Deleted Successfully",
  ADMIN_DELETED_VENDOR: "Admin Deleted Vendor",
  ADMIN_DELETED_USER: "Admin Deleted User",
  CATEGORY_DELETED: "Category Deleted Successfully",
  VENDOR_BLOCK: "Vendor Blocked successfully",
};

// module.exports = {
//   PUSH_NOTIFICATION_STATUS,
//   NOTIFICATION_STATUS,
//   DELETE_MASSAGES,
//   TOKEN_TYPE,
//   USER_TYPE,
//   JOI,
//   DEVICE_TYPE,
//   SKILL_LEVEL,
//   WORK_LOCATION,
//   ASSIGNMENT_STATUS,
//   REQUEST_STATUS,
//   SUCCESS_MESSAGES,
//   ERROR_MESSAGES,
//   STATUS_CODES,
//   UPDATED_MESSAGES,
//   SOCIAL_LOGIN,
//   PRONOUN,
//   GENDER,
//   PETS,
//   HOBBIES_AND_INTRESTS,
//   POLITICALS_VIEWS,
//   LOOKIN_FOR,
//   DRUGS,
//   LIFE_STYLE,
//   PREFERANCES,
//   SIGN,
//   VALIDPRONOUN,
//   VALID_GENDER,
//   VALID_PETS,
//   VALID_HOBBIES_AND_INTRESTS,
//   VALID_POLITICALS_VIEWS,
//   VALID_LOOKIN_FOR,
//   VALID_DRUGS,
//   VALID_LIFE_STYLE,
//   VALID_PREFERANCES,
//   VALID_SIGN,
//   DISTANCE,
//   MESSAGE_TYPE,
//   PLANS,
//   PLAN,
//   SOCIAL_TYPE,
// };

// SPA: "spa",
// FOOD: "food",
// FOOTWEAR: "footwear",
// CLOTHING: "clothing",
// CANNABIS: "cannabis",
// BUFFET: "buffet",
// SALON: "salon",
// HEATH: "heath",
// ACTIVITY: "activity",
