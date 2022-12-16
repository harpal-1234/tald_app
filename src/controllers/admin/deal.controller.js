const { adminDealService, } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {formatCategory, formatDeal}=require("../../utils/commonFunction")

const addCategory=catchAsync(async(req,res)=>{
  const category=await adminDealService.addCategory(req.body.categoryName);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CATEGORY_ADDED,
    )

});

const deleteCategory=catchAsync(async(req,res)=>{
  const category=await adminDealService.deleteCategory(req.query.categoryId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.CATEGORY_DELETED
    )

})

const getAllCategory=catchAsync(async(req,res)=>{
  const category=await adminDealService.getAllCategory(req,res);
  const value=await formatCategory(category);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CATEGORY_DATA,
    value
    )

});


const getAllDeal=catchAsync(async(req,res)=>{
  const deal=await adminDealService.getAllDeal(req,res);
  const value=await formatDeal(deal);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CATEGORY_DATA,
    value
    )

})

module.exports={
  addCategory,
  deleteCategory,
  getAllCategory,
  getAllDeal
}