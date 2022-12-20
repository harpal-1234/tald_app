const { userService, tokenService, dealsService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");
const { formatDeal,formatStoreDeal } = require("../../utils/commonFunction");
const {storeDistance}=require("../../utils/storeDistance");

const homeData = catchAsync(async (req, res) => {
  const data = await dealsService.homeData(req.body);
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

const purchaseDeal = catchAsync(async (req, res) => {
  const data = await dealsService.purchaseDeal(req.token.user._id, req.body.dealId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const storeDeal= catchAsync(async (req, res) => {
  const data = await dealsService.storeDeal(req.query.storeId);
  const store=await storeDistance(req.query.storeId,req.query.long,req.query.lat);
  const value=formatStoreDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
     value,
     store
  );
});

const favouriteStore= catchAsync(async (req, res) => {
  const user=await dealsService.favouriteStore(req.body.storeId,req.token.user._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FAVORITE_DATA
  );
});

module.exports = {
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore
};
