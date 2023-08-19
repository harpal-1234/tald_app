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
  //validate(authValidation.createProject),                
  authController.getInteriorDesigners
);

export default router;
