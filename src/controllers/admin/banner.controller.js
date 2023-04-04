const { adminBannerService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const bannerAction = catchAsync(async (req, res) => {
  const { bannerId } = req.query;
  const bannerAction = await adminBannerService.bannerAction(bannerId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    bannerAction
  );
});

const bannerRequest = catchAsync(async (req, res) => {
  const bannerRequest = await adminBannerService.bannerRequest(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.BANNER_DATA,
    bannerRequest
  );
});
const getAllBanners = catchAsync(async (req, res) => {
  let { page, limit, search, startDate, endDate } = req.query;
  const banners = await adminBannerService.getAllBanners(
    page,
    limit,
    search,
    startDate,
    endDate
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.BANNER_DATA,
    banners
  );
});

const deleteBanner = catchAsync(async (req, res) => {
  const bannerRequest = await adminBannerService.deleteBanner(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.BANNER_DELETED
  );
});
const payment = catchAsync(async (req, res) => {
  let { page, limit, search, startDate, endDate } = req.query;
  const banners = await adminBannerService.payment(
    page,
    limit,
    search,
    startDate,
    endDate
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.BANNER_DATA,
    banners
  );
});
module.exports = {
  bannerAction,
  bannerRequest,
  deleteBanner,
  getAllBanners,
  payment,
};
