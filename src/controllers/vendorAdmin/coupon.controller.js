const { vendorCouponService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");


const createCoupon=catchAsync(async(req,res)=>{
    const coupon=await vendorCouponService.createCoupon(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.DEFAULT,
      );
    });


module.exports={
    createCoupon
}