const { vendorStoreService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const { format } = require("morgan");
const { formatStore, formatCategory } = require("../../utils/commonFunction");

// const createStore = catchAsync(async (req, res) => {
//   const newStore = await vendorStoreService.createStore(req.body,req.token.vendor._id);
//   return successResponse(
//     req,
//     res,
//     STATUS_CODES.SUCCESS,
//     SUCCESS_MESSAGES.DEFAULT,
//     newStore
//   );
// });
const getStoreDetails=catchAsync(async(req,res)=>{
  const store = await vendorStoreService.getStoreDetails(req.token.vendor._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    store
  );
})

const editStoreDetails = catchAsync(async (req, res) => {
  const editStore = await vendorStoreService.editStoreDetails(req.body,req.token.vendor._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    editStore
  );
});

const deleteStore = catchAsync(async (req, res) => {
  const store = await vendorStoreService.deleteStore(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.STORE_DELETED
  );
});

const vendorStoreName=catchAsync(async (req, res) => {
  const store = await vendorStoreService.vendorStoreName(req.token.vendor._id);
  const value=formatStore(store)
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.STORE_DELETED,
   value
  );
});

const getStoreCategory=catchAsync(async (req, res) => {
  const store = await vendorStoreService.getStoreCategory(req,res);
  const value=formatCategory(store)
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.ALL_CATEGORY,
   value
  );
});


module.exports = {
  // createStore,
  getStoreDetails,
  editStoreDetails,
  deleteStore,
  vendorStoreName,
  getStoreCategory
};
