const { userService, tokenService, dealsService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");
const { formatDeal } = require("../../utils/commonFunction");

const homeData = catchAsync(async (req, res) => {
  const data = await dealsService.homeData(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const getCategoryData = catchAsync(async (req, res) => {
  const data = await dealsService.getCategoryData(req, res);
  const category = formatDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    category
  );
});

const nearestService = catchAsync(async (req, res) => {
  const data = await dealsService.nearestService(req, res);
  const nearYou = formatDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    nearYou
  );
});

module.exports = {
  homeData,
  getCategoryData,
  nearestService,
};
