const { adminBannerService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const bannerAction=catchAsync(async(req,res)=>{
    const bannerAction=await adminBannerService.bannerAction(req,res);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.BANNER_STATUS,
        bannerAction
        )

});

const bannerRequest=catchAsync(async(req,res)=>{
    const bannerRequest=await adminBannerService.bannerRequest(req,res);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.BANNER_DATA,
        bannerRequest
        )

});
const getAllBanners=catchAsync(async(req,res)=>{
    let { page, limit, search, startDate, endDate } = req.query;
    const banners=await adminBannerService.getBanners(page, limit, search, startDate, endDate);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.BANNER_DATA,
        banners
        )

});

const deleteBanner=catchAsync(async(req,res)=>{
    const bannerRequest=await adminBannerService.deleteBanner(req,res);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        DELETE_MASSAGES.BANNER_DELETED
        )

});

module.exports={
    bannerAction,
    bannerRequest,
    deleteBanner,
    getAllBanners
}