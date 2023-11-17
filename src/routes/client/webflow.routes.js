import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import * as webFlowValidation from "../../validations/app/vendor.validation.js";
import * as webFlowController from "../../controllers/app/webFlow.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.get(
  "/getSites",
  auth(USER_TYPE.NON_USER),
  //validate(webFlowValidation.getInteriorDesigner),
  webFlowController.sites
);
export default router;
