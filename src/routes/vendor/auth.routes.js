const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const adminController = require("../../controllers/vendor/auth.controller");
const adminValidation = require("../../validations/vendor/auth.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/signup",
    validate(adminValidation.adminSignUp),
    adminController.adminSignUp
  );


router.post(
  "/login",
  validate(adminValidation.adminLogin),
  adminController.adminLogin
);

router.put(
  "/changePassword",
  auth(USER_TYPE.ADMIN),
  validate(adminValidation.changePassword),
  adminController.changePassword
);

router.get("/dashboard", auth(USER_TYPE.VENDOR_ADMIN), adminController.dashBoard);


router.post(
  '/logout',
  auth(USER_TYPE.VENDOR_ADMIN),
  adminController.adminLogout
)

module.exports = router;