const { userService,tokenService,dealsService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE
} = require("../../config/appConstants");

const homeData=catchAsync(async (req, res) => {
    const data = await dealsService.homeData(req,res);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.SUCCESS,
      data
    );
  });

  module.exports={
    homeData
  }
  