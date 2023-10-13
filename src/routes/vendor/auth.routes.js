import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import * as vendorValidation from "../../validations/app/vendor.validation.js";
import * as vendorController from "../../controllers/app/vendor.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post(
  "/createProject",
  auth(USER_TYPE.USER),
  validate(vendorValidation.createProject),
  vendorController.createProject
);
router.get(
  "/seeProjects",
  auth(USER_TYPE.USER),
  //validate(vendorValidation.seeProject),
  vendorController.seeProject
);
router.post(
  "/addImages",
  auth(USER_TYPE.USER),
  validate(vendorValidation.addImages),
  vendorController.addImages
);
router.get("/portfolio", auth(USER_TYPE.USER), vendorController.getPortfolio);
router.delete(
  "/deleteProject",
  auth(USER_TYPE.USER),
  validate(vendorValidation.deleteProject),
  vendorController.deleteProject
);
router.delete(
  "/deleteProjectImages",
  auth(USER_TYPE.USER),
  validate(vendorValidation.deleteProjectImages),
  vendorController.deleteProjectImages
);
router.put(
  "/addAvailability",
  auth(USER_TYPE.USER),
  validate(vendorValidation.addAvailability),
  vendorController.addAvailability
);
router.get(
  "/getAvailability",
  auth(USER_TYPE.USER),
  vendorController.getAvailability
);
router.put(
  "/editProjetDetail",
  auth(USER_TYPE.USER),
  validate(vendorValidation.editProject),
  vendorController.editProjectDetails
);
router.put(
  "/editCompanyDetails",
  auth(USER_TYPE.USER),
  validate(vendorValidation.editCompanyDetails),
  vendorController.editCompanyDetails
);
router.put(
  "/feeStructure",
  auth(USER_TYPE.USER),
  validate(vendorValidation.feeStructure),
  vendorController.editFeeStructure
);
router.put(
  "/editVendorProfile",
  auth(USER_TYPE.USER),
  validate(vendorValidation.editVendorProfile),
  vendorController.editVendorProfile
);
router.get(
  "/getConsultations",
  auth(USER_TYPE.USER),
  validate(vendorValidation.getConsultations),
  vendorController.getConsultations
);
router.put(
  "/consultationAction",
  auth(USER_TYPE.USER),
  validate(vendorValidation.consultationAction),
  vendorController.consultationAction
);
router.get(
  "/getProjectInqueries",
  auth(USER_TYPE.USER),
  validate(vendorValidation.getProjectInqueries),
  vendorController.getProjectInqueries
);
router.put(
  "/ActionProjectInquery",
  auth(USER_TYPE.USER),
  validate(vendorValidation.actionProjectQuery),
  vendorController.actionProjectInquery
);
router.get(
  "/getConversations",
  auth(USER_TYPE.USER),
  validate(vendorValidation.getConversations),
  vendorController.getConversations
);
router.get(
  "/getChat",
  auth(USER_TYPE.USER),
  validate(vendorValidation.getChat),
  vendorController.getChat
);
export default router;
