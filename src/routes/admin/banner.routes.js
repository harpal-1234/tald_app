const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/auth.validation");
const authController = require("../../controllers/admin/banner.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();

router.get(
    "/request",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.changePassword),
    authController.bannerRequest
  );

  router.post(
    "/action",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.changePassword),
    authController.bannerAction
  );

  module.exports=router