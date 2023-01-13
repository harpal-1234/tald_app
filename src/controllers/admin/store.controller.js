const { adminStoreService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  UPDATED_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {formatStore, formatStoreDeal}=require("../../utils/commonFunction")


const createStoreDetails=catchAsync(async (req, res) => {
  const store = await adminStoreService.createStoreDetails(req.body,res);
  const value=formatStore(store);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.STORE_DATA,
    value
  );
});

const getAllStore = catchAsync(async (req, res) => {
    const store = await adminStoreService.getAllStore(req,res);
    const value=formatStore(store);
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.STORE_DATA,
      store
    );
  });


const getStoreDeals= catchAsync(async (req, res) => {
  const store = await adminStoreService.getStoreDeals(req.query.storeId);
  const value=formatStoreDeal(store);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.STORE_DATA,
    value
  );
});

const deleteStore= catchAsync(async (req, res) => {
  const store = await adminStoreService.deleteStore(req.query.storeId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.STORE_DELETED,
 
  );
})


const editStoreDetails= catchAsync(async (req, res) => {
  const newStore = await adminStoreService.editStoreDetails(req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT
  );
});

  module.exports={
    getAllStore,
    getStoreDeals,
    deleteStore,
    editStoreDetails,
    createStoreDetails
  }