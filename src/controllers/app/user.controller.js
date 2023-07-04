import  {appServices } from "../../services/index.js";
import  config from "../../config/config.js";
import  { catchAsync } from "../../utils/universalFunction.js";
import  { successResponse } from "../../utils/response.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
}from "../../config/appConstants.js";

// const formatRes = require("../../../utils/formatResponse");
import  {
  successMessageWithoutData,
  successMessage,
} from "../../utils/commonFunction.js";
import  dotenv from "dotenv";
dotenv.config();

export const getUser = catchAsync(async (req, res) => {
  const { lat, long } = req.query;
  const userId = req.token.user._id;
  const users = await appServices.getUsers(userId, lat, long);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    users

    //user.phoneNumber
  );
});
