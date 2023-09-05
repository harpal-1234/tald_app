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
    projectSize
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
