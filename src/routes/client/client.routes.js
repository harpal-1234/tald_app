import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import * as clientValidation from "../../validations/app/vendor.validation.js";
import * as clientController from "../../controllers/app/user.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.get(
  "/interiorDesigner",
  auth(USER_TYPE.NON_USER),
  validate(clientValidation.getInteriorDesigner),
  clientController.getInteriorDesigners
);
router.get(
  "/interiorDesignerById",
  auth(USER_TYPE.NON_USER),
  validate(clientValidation.getInteriorDesignerById),
  clientController.getInteriorDesignerById
);
router.put(
  "/saveProfile",
  auth(USER_TYPE.USER),
  validate(clientValidation.saveProfile),
  clientController.saveProfile
);
router.get(
  "/getSaveProfiles",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSaveProfile),
  clientController.getSaveProfile
);
router.get(
  "/getSlots",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSlots),
  clientController.getSlots
);
router.get(
  "/getSlotDates",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSlotDates),
  clientController.getSlotDates
);
router.post(
  "/bookConsultations",
  auth(USER_TYPE.USER),
  validate(clientValidation.bookConsultations),
  clientController.bookConsultations
);
router.put(
  "/rescheduledConsultation",
  auth(USER_TYPE.USER),
  validate(clientValidation.rescheduledBookConsultations),
  clientController.rescheduledBookConsultations
);
router.put(
  "/addFileConsultation",
  auth(USER_TYPE.USER),
  validate(clientValidation.addFileConsultation),
  clientController.addFileConsultation
);
router.get(
  "/getConsultations",
  auth(USER_TYPE.USER),
  validate(clientValidation.getConsultations),
  clientController.getConsultations
);
router.post(
  "/createProjectInquery",
  auth(USER_TYPE.USER),
  validate(clientValidation.createProjectInquery),
  clientController.createProjectInquery
);
router.delete(
  "/deleteProjectInqueryImage",
  auth(USER_TYPE.USER),
  validate(clientValidation.deleteProjectInqueryImage),
  clientController.deleteProjectInqueryImage
);

router.delete(
  "/deleteProjectInquery",
  auth(USER_TYPE.USER),
  validate(clientValidation.deleteProjectInquery),
  clientController.deleteProjectInquery
);
router.get(
  "/getProjectInqueries",
  auth(USER_TYPE.USER),
  validate(clientValidation.getProjectInqueries),
  clientController.getProjectInqueries
);
router.get("/getProjects", auth(USER_TYPE.USER), clientController.getProjects);
router.put(
  "/editProjectInqueries",
  auth(USER_TYPE.USER),
  validate(clientValidation.editProjectInquery),
  clientController.editProjectInquery
);
router.put(
  "/submitProjectInqueries",
  auth(USER_TYPE.USER),
  validate(clientValidation.submitProjectInquery),
  clientController.submitProjectInquery
);
router.get(
  "/getInqueryStatus",
  auth(USER_TYPE.USER),
  validate(clientValidation.getInqueryStatus),
  clientController.getInqueriesStatus
);
router.get(
  "/getConversations",
  auth(USER_TYPE.USER),
  validate(clientValidation.getConversations),
  clientController.getConversations
);
router.get(
  "/getChat",
  auth(USER_TYPE.USER),
  validate(clientValidation.getChat),
  clientController.getChat
);
router.delete(
  "/deleteChat",
  auth(USER_TYPE.USER),
  validate(clientValidation.deleteChat),
  clientController.deleteChat
);
router.put(
  "/blockUser",
  auth(USER_TYPE.USER),
  validate(clientValidation.blockUser),
  clientController.blockUser
);
router.put(
  "/unBlockUser",
  auth(USER_TYPE.USER),
  validate(clientValidation.blockUser),
  clientController.unBlockUser
);
router.put(
  "/deleteConversation",
  auth(USER_TYPE.USER),
  validate(clientValidation.deleteChat),
  clientController.clearConversation
);
router.put(
  "/saveImages",
  auth(USER_TYPE.USER),
  validate(clientValidation.saveImages),
  clientController.saveImages
);
router.get(
  "/getSaveImages",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSaveImages),
  clientController.getSaveImages
);
router.post(
  "/review",
  auth(USER_TYPE.USER),
  validate(clientValidation.review),
  clientController.review
);
router.put(
  "/cancelBooking",
  auth(USER_TYPE.USER),
  validate(clientValidation.cancelBooking),
  clientController.cancelBooking
);

export default router;
