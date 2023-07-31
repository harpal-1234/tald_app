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
router.post(
  "/addImages",
  auth(USER_TYPE.USER),
  validate(authValidation.addImages),
  authController.addImages
);
router.get(
  "/portfolio",
  auth(USER_TYPE.USER),
  //validate(authValidation.addImages),
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
// router.get(
//   "/users",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.getUsers),
//   authController.userList
// );
export default router;

