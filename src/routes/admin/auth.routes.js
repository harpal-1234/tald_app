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
router.get(
  "/dashboard",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.dashboard),
  authController.dashboard
);
router.get(
  "/virtualConsultations",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getConsultation),
  authController.getConsultations
);
router.get(
  "/inqueryList",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getConsultation),
  authController.inqueryList
);
router.get(
  "/approvedInqueryList",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getConsultation),
  authController.approvedInqueryList
);
router.get(
  "/actionOnInquery",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.iqueryOnAction),
  authController.actionOnInquery
);
router.get(
  "/getClientDetails",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getClientDetails),
  authController.getClientDetails
);
export default router;
