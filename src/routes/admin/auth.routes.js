const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/auth.validation");
const authController = require("../../controllers/admin/auth.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
  "/login",
  validate(authValidation.adminLogin),
  authController.adminLogin
);

router.put(
  "/changePassword",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.changePassword),
  authController.changePassword
);

router.post("/logout", auth(USER_TYPE.ADMIN), authController.adminLogout);
router.get(
  "/getDashboard",
  auth(USER_TYPE.ADMIN),
  // validate(authValidation.changePassword),
  authController.dashBoard
);
router.post(
  "/createGroup",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.createGroup),
  authController.createGroup
);
router.get(
  "/getGroup",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getGroup),
  authController.getGroup
);
router.get(
  "/getUser",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getUser),
  authController.getUser
);
router.put(
  "/userAction",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.userAction),
  authController.userAction
);
router.delete(
  "/deleteUser",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.userAction),
  authController.userDelete
);
router.delete(
  "/deleteGroup",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.deleteGroup),
  authController.deleteGroup
);
router.get(
  "/dashBoard",
  auth(USER_TYPE.ADMIN),
  //validate(authValidation.deleteGroup),
  authController.dashBoard
);
router.get(
  "/allUser",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.allUser),
  authController.allUser
);
module.exports = router;
