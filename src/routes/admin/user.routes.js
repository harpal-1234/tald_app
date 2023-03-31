const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/user.validation");
const authController = require("../../controllers/admin/user.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
  "/create",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.createUser),
  authController.createUser
);

router.get(
  "/getAll",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getAllUser),
  authController.getAllUser
);

router.put(
  "/editProfile",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.editUserProfile),
  authController.editUserProfile
);
router.put(
  "/userAction",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.userAction),
  authController.userAction
);
router.delete(
  "/delete",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.deleteUser),
  authController.deleteUser
);
module.exports = router;
