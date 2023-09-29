import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import * as authValidation from "../../validations/app/vendor.validation.js";
import * as authController from "../../controllers/app/user.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.get(
  "/interiorDesigner",
  auth(USER_TYPE.NON_USER),
  validate(authValidation.getInteriorDesigner),                
  authController.getInteriorDesigners
);
router.get(
  "/interiorDesignerById",
  auth(USER_TYPE.NON_USER),
  validate(authValidation.getInteriorDesignerById),                
  authController.getInteriorDesignerById
);
router.put(
  "/saveProfile",
  auth(USER_TYPE.USER),
  validate(authValidation.saveProfile),                
  authController.saveProfile
);
router.put(
  "/getSaveProfiles",
  auth(USER_TYPE.USER),
  validate(authValidation.getSaveProfile),                
  authController.saveProfile
);
router.get(
  "/getSlots",
  auth(USER_TYPE.USER),
  validate(authValidation.getSlots),                
  authController.getSlots
);
export default router;
