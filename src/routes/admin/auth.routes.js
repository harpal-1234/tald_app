import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import authValidation from "../../validations/admin/auth.validation.js";
import * as authController from "../../controllers/admin/auth.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post(
  "/login",
  validate(authValidation.adminLogin),
  authController.adminLogin
);
router.get(
  "/users",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getUsers),
  authController.userList
);
router.post("/logout", auth(USER_TYPE.ADMIN), authController.adminLogout);

export default router;
