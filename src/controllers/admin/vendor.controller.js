const { adminVendorService, tokenService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
  UPDATED_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {formatVendor}=require("../../utils/commonFunction")
const createVendor=catchAsync(async(req,res)=>{
    const vendor=await adminVendorService.createVendor(req.body,req.token.admin._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.VENDOR_ADMIN,
        )
})


const getAllVendor=catchAsync(async(req,res)=>{
  const vendor=await adminVendorService.getAllVendor(req,res);
  const value=formatVendor(vendor.vendorData);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.VENDOR_ADMIN,
      value
      )
})

const deleteVendor=catchAsync(async(req,res)=>{
  const vendor=await adminVendorService.deleteVendor(req,res);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      DELETE_MASSAGES.ADMIN_DELETED_VENDOR,
      )
});


const editVendorProfile=catchAsync(async(req,res)=>{
  const vendor=await adminVendorService.editVendorProfile(req,res);
  return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      UPDATED_MESSAGES.USER_UPDATED
      )
})
module.exports={
    createVendor,
    getAllVendor,
    deleteVendor,
    editVendorProfile
}