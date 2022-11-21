const { vendorCouponService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse} = require("../../utils/response");
const {formatCoupon}=require("../../utils/commonFunction");


const createCoupon=catchAsync(async(req,res)=>{

    const coupon=await vendorCouponService.createCoupon(req.body,req.token.vendor._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.DEFAULT,
      );
    });

const getCoupon=catchAsync(async(req,res)=>{

  const coupon=await vendorCouponService.getCoupon(req.query,req.token.vendor._id);
  console.log(coupon);
  const value=formatCoupon(coupon);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DEFAULT,
     value
    );
  });

const deleteCoupon=catchAsync(async(req,res)=>{

  const coupon=await vendorCouponService.deleteCoupon(req.query,req.token.vendor._id);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      DELETE_MASSAGES.COUPON_DELETED
    );
  });

module.exports={
    createCoupon,
    getCoupon,
    deleteCoupon
}