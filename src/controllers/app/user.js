import { clientServices } from "../../services/index.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";

export const getInteriorDesigners = catchAsync(async (req, res) => {
  const {
    type,
    lat,
    long,
    projectType,
    destination,
    consultationLength,
    minimumPrice,
    maximumPrice,
    preferences,
    styles,
    goals,
    projectSize,
    page,
    limit,
  } = req.query;

  // const userId = req.token.user._id;
  const project = await clientServices.getInteriorDesigners(
    type,
    lat,
    long,
    projectType,
    destination,
    consultationLength,
    minimumPrice,
    maximumPrice,
    preferences,
    styles,
    goals,
    projectSize,
    page,
    limit
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const getInteriorDesignerById = catchAsync(async (req, res) => {
  const { designerId, page, limit } = req.query;

  // const userId = req.token.user._id;
  const project = await clientServices.getInteriorDesignerById(
    designerId,
    page,
    limit
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    project
  );
});
export const saveProfile = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const designer = await clientServices.saveProfile(
    req.body.designerId,
    userId
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
export const getSlots = catchAsync(async (req, res) => {
  const { designerId, date, timeDuration } = req.query;
  const userId = req.token.user._id;
  const slots = await clientServices.getSlots(
    designerId,
    date,
    userId,
    timeDuration
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    slots
  );
});
export const bookConsultations = catchAsync(async (req, res) => {
  const { designerId, timeSlots, projectSummary ,files} = req.body;
  const userId = req.token.user._id;
  const slots = await clientServices.bookConsultations(
    designerId,
    timeSlots,
    projectSummary,
    userId,
    files
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    slots
  );
});
export const getSaveProfile = catchAsync(async (req, res) => {
  const { userId } = req.token.user._id;
  const designer = await clientServices.saveProfile(
    req.body.designerId,
    userId
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
