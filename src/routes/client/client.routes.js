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
router.put(
  "/getSaveProfiles",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSaveProfile),
  clientController.saveProfile
);
router.get(
  "/getSlots",
  auth(USER_TYPE.USER),
  validate(clientValidation.getSlots),
  clientController.getSlots
);
router.post(
  "/bookConsultations",
  auth(USER_TYPE.USER),
  validate(clientValidation.bookConsultations),
  clientController.bookConsultations
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
router.get(
  "/getProjectInqueries",
  auth(USER_TYPE.USER),
  validate(clientValidation.getProjectInqueries),
  clientController.getProjectInqueries
);
router.put(
  "/editProjectInqueries",
  auth(USER_TYPE.USER),
  validate(clientValidation.editProjectInquery),
  clientController.editProjectInquery
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
export default router;
