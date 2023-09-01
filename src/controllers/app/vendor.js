import {
  vendorServices,
} from "../../services/index.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} from "../../config/appConstants.js";
import dotenv from "dotenv";
dotenv.config();

export const createProject = catchAsync(async (req, res) => {
  const { projectName } = req.body;
  const userId = req.token.user._id;
  const project = await vendorServices.createProject(userId, projectName);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const addImages = catchAsync(async (req, res) => {
  const { images, projectId } = req.body;
  const userId = req.token.user._id;
  const project = await vendorServices.addImages(userId, projectId, images);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const getPortfolio = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const project = await vendorServices.Portfolio(userId);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.query;
  const userId = req.token.user._id;
  const project = await vendorServices.deleteProject(userId, projectId);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DELETE_PROJECT
  );
});
export const deleteProjectImages = catchAsync(async (req, res) => {
  const { imageIds, projectId } = req.body;
  const userId = req.token.user._id;
  const project = await vendorServices.deleteProjectImages(
    imageIds,
    projectId,
    userId
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const addAvailability = catchAsync(async (req, res) => {
  const { weeklySchedule, availability, isIndefinitely, inviteesSchedule } =
    req.body;
  const userId = req.token.user._id;
  const project = await vendorServices.addAvailability(
    weeklySchedule,
    availability,
    isIndefinitely,
    inviteesSchedule,
    userId
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const getAvailability = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const project = await vendorServices.getAvailability(userId);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const editProjectDetails = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const project = await vendorServices.editProjectDetails(req.body, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const editCompanyDetails = catchAsync(async (req, res) => {
  const userId = req.token.user._id;                        
  const project = await vendorServices.editCompanyDetails(req.body, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const editFeeStructure = catchAsync(async (req, res) => {
  const userId = req.token.user._id;                        
  const project = await vendorServices.editFeeStructure(req.body, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});

export const editVendorProfile = catchAsync(async (req, res) => {
  const userId = req.token.user._id;                        
  const project = await vendorServices.editVendorProfile(req.body, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});