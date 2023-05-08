const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/auth.validation");
const authController = require("../../controllers/admin/auth.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();



router.post(
  "/login",
  validate(authValidation.adminLogin),
  authController.adminLogin
)

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
  //validate(authValidation.createGroup),
  authController.getGroup
);
module.exports = router;