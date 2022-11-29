const { adminService, bannerService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");


const createBanner = catchAsync(async (req, res) => {

    const banner = await bannerService.createBanner(req.body,req.token.vendor._id);
   
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DEFAULT,
      banner
    );
  })


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

  const bannerRequest=catchAsync(async(req,res)=>{
    const banner=await bannerService.bannerRequest(req.params,req.token.vendor._id);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.BANNER_REQUEST
    );

  })


  const deleteBanner = catchAsync(async (req, res) => {
    const banner = await bannerService.deleteBanner(req.query);
   
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      DELETE_MASSAGES.BANNER_DELETED
    );
  })

  const getBanner = catchAsync(async (req, res) => {
    console.log("working");
    const banner = await bannerService.getBanner(req.query);
   
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DEFAULT,
      banner.bannerData,
      banner.total
    );
  })

  module.exports={
    createBanner,
    editBanner,
    deleteBanner,
    getBanner,
    bannerRequest
  }