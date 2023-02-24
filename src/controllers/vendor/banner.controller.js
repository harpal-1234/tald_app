const { adminService, bannerService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const { formatBanner } = require("../../utils/commonFunction");

const createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(
    req.body,
    req.token.user._id
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    banner
  );
});

const editBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.editBanner(req.body);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    banner
  );
});

const bannerAction = catchAsync(async (req, res) => {
  const banner = await bannerService.bannerAction(
    req.query,
    req.token.user._id
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    banner
  );
});

const deleteBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.deleteBanner(req.query);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.BANNER_DELETED
  );
});

const getBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.getBanner(req.query, req.token.user._id);
  const value = formatBanner(banner.bannerData);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    value,
    banner.total
  );
});

module.exports = {
  createBanner,
  editBanner,
  deleteBanner,
  getBanner,
  bannerAction,
};
