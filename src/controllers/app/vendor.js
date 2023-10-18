import { vendorServices } from "../../services/index.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { successResponse } from "../../utils/response.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} from "../../config/appConstants.js";
import * as chatServices from "../../services/app.services.js/chat.js";
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
export const seeProject = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const projects = await vendorServices.seeProject(userId);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    projects
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
export const getConsultations = catchAsync(async (req, res) => {
  const designerId = req.token.user._id;

  const consultations = await vendorServices.getConsultations(
    req.query.page,
    req.query.limit,
    designerId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    consultations
  );
});

export const consultationAction = catchAsync(async (req, res) => {
  const designerId = req.token.user._id;
  const consultation = await vendorServices.consultationAction(
    req.body.consultationId,
    req.body.confirmTime,
    designerId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    consultation
  );
});
export const getProjectInqueries = catchAsync(async (req, res) => {
  const designerId = req.token.user._id;
  const projects = await vendorServices.getProjectInqueries(
    req.query.page,
    req.query.limit,
    designerId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    projects
  );
});
export const actionProjectInquery = catchAsync(async (req, res) => {
  const projects = await vendorServices.actionProjectInquery(
    req.body.Id,
    req.body.status,
    req.token.user._id,
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
  );
});
export const getConversations = catchAsync(async (req, res) => {
  const conversations = await chatServices.getConversation(
    req.query.page,
    req.query.limit,
    req.token.user._id
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    conversations
  );
});
export const getChat = catchAsync(async (req, res) => {
  const { conversationId, page, limit } = req.query;
  const userId = req.token.user._id;
  const chat = await chatServices.getChat(conversationId, userId, page, limit);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    chat
  );
});
export const deleteChat = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const chat = await chatServices.deleteChat(req.body.conversationId, userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
export const blockUser = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await chatServices.blockUser(
    req.body.conversationId,
    req.body.userId,
    userId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
export const unBlockUser = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await chatServices.unBlockUser(
    req.body.conversationId,
    req.body.userId,
    userId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
export const clearConversation = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const data = await chatServices.deleteConversation(
    req.body.conversationId,
    userId
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});
