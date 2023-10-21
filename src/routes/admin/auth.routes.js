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
router.put(
  "/chnagePassword",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.changePassword),
  authController.changePassword
);
router.get(
  "/vendorList",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getUsers),
  authController.vendorList
);
router.get(
  "/requests",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getUsers),
  authController.requests
);
router.put(
  "/requestAction",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.requestAction),
  authController.requestAction
);
router.put(
  "/userAction",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.userAction),
  authController.userAction
);
router.post(
  "/createVendor",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.register),
  authController.createVendor
);
router.post(
  "/createFilterData",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.filterData),
  authController.filterData
);
router.post("/logout", auth(USER_TYPE.ADMIN), authController.adminLogout);

export default router;
