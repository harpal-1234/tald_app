const { vendorStoreService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const createStore = catchAsync(async (req, res) => {
  const newStore = await vendorStoreService.createStore(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    newStore
  );
});

const editStoreDetails = catchAsync(async (req, res) => {
  const newStore = await vendorStoreService.editStoreDetails(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT
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

module.exports = {
  createStore,
  editStoreDetails,
  deleteStore,
};
