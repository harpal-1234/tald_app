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
const { formatVendor } = require("../../utils/commonFunction");
const createVendor = catchAsync(async (req, res) => {
  const vendor = await adminVendorService.createVendor(req.body);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.VENDOR_ADMIN
  );
});

const getAllVendor = catchAsync(async (req, res) => {
  let { page, limit, search, startDate, endDate } = req.query;
  const vendor = await adminVendorService.getAllVendor(
    page,
    limit,
    search,
    startDate,
    endDate
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    vendor.Vendors,
    vendor.total
  );
});
const vendorDetails = catchAsync(async (req, res) => {
  let { page, limit, search, type, vendorId } = req.query;
  const vendor = await adminVendorService.vendorDeals(
    page,
    limit,
    search,
    type,
    vendorId
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    vendor
  );
});
const deleteVendor = catchAsync(async (req, res) => {
  const vendor = await adminVendorService.deleteVendor(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    DELETE_MASSAGES.ADMIN_DELETED_VENDOR
  );
});

const blockVendor = catchAsync(async (req, res) => {
  const vendor = await adminVendorService.blockVendor(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    vendor
  );
});
const editVendorProfile = catchAsync(async (req, res) => {
  const vendor = await adminVendorService.editVendorProfile(req, res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    UPDATED_MESSAGES.USER_UPDATED
  );
});
module.exports = {
  createVendor,
  getAllVendor,
  deleteVendor,
  editVendorProfile,
  blockVendor,
  vendorDetails,
};
