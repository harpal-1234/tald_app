const { vendorDealsService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse} = require("../../utils/response");
const {formatCoupon}=require("../../utils/commonFunction");


const createDeal=catchAsync(async(req,res)=>{

    const deal=await vendorDealsService.createDeal(req.body,req.token.vendor._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.DEFAULT,
      );
    });

const getAllDeal=catchAsync(async(req,res)=>{

  const deal=await vendorDealsService.getAllDeal(req.query,req.token.vendor._id);
  const value=formatCoupon(deal.couponData);
 
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DEFAULT,
     value,
     deal.total
    );
  });

const deleteDeal=catchAsync(async(req,res)=>{

  const coupon=await vendorDealsService.deleteDeal(req.query,req.token.vendor._id);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      DELETE_MASSAGES.COUPON_DELETED
    );
  });

module.exports={
    createDeal,
    getAllDeal,
    deleteDeal
}