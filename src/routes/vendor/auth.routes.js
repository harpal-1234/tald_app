import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import * as authValidation from "../../validations/app/vendor.validation.js";
import * as authController from "../../controllers/app/vendor.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post(
  "/createProject",
  auth(USER_TYPE.USER),
  validate(authValidation.createProject),
  authController.createProject
);
router.get(
  "/seeProjects",
  auth(USER_TYPE.USER),
  //validate(authValidation.seeProject),
  authController.seeProject
);
router.post(
  "/addImages",
  auth(USER_TYPE.USER),
  validate(authValidation.addImages),
  authController.addImages
);
router.get(
  "/portfolio",
  auth(USER_TYPE.USER),
  authController.getPortfolio
);
router.delete(
  "/deleteProject",
  auth(USER_TYPE.USER),
  validate(authValidation.deleteProject),
  authController.deleteProject
);
router.delete(
  "/deleteProjectImages",
  auth(USER_TYPE.USER),
  validate(authValidation.deleteProjectImages),
  authController.deleteProjectImages
);
router.put(
  "/addAvailability",
  auth(USER_TYPE.USER),
  validate(authValidation.addAvailability),
  authController.addAvailability
);
router.get(
  "/getAvailability",
  auth(USER_TYPE.USER),
  authController.getAvailability
);
router.put(
  "/editProjetDetail",
  auth(USER_TYPE.USER),
  validate(authValidation.editProject),
  authController.editProjectDetails
);
router.put(
  "/editCompanyDetails",
  auth(USER_TYPE.USER),
  validate(authValidation.editCompanyDetails),           
  authController.editCompanyDetails
);
router.put(
  "/feeStructure",
  auth(USER_TYPE.USER),
  validate(authValidation.feeStructure),           
  authController.editFeeStructure
);
router.put(
  "/editVendorProfile",
  auth(USER_TYPE.USER),
  validate(authValidation.editVendorProfile),           
  authController.editVendorProfile
);
router.get(
  "/getConsultations",
  auth(USER_TYPE.USER),
  validate(authValidation.getConsultations),           
  authController.getConsultations
);
router.put(
  "/consultationAction",
  auth(USER_TYPE.USER),
  validate(authValidation.consultationAction),           
  authController.consultationAction
);
router.get(
  "/zoom",
  // auth(USER_TYPE.USER),
  // validate(authValidation.getConsultations),           
  authController.zoom
);
router.get(
  "/callBack",
  // auth(USER_TYPE.USER),
  // validate(authValidation.getConsultations),           
  authController.callBack
);
export default router;
