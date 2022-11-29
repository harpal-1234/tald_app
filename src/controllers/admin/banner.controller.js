const { adminBannerService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const bannerAction=catchAsync(async(req,res)=>{
    const bannerAction=await adminBannerService.bannerAction(req,res);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.LOGOUT,
        bannerAction
        )

});

const bannerRequest=catchAsync(async(req,res)=>{
    const bannerRequest=await adminBannerService.bannerRequest(req,res);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.BANNER_STATUS,
        bannerRequest
        )

});

module.exports={
    bannerAction,
    bannerRequest
}