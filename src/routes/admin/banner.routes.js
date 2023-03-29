const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/banner.validation");
const authController = require("../../controllers/admin/banner.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");


const router = express.Router();

router.get(
    "/getBanners",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.getBanners),
    authController.getAllBanners
  );
  router.get(
    "/payment",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.payment),
    authController.payment
  );
  router.post(
    "/action",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.bannerRequest),
    authController.bannerAction
  );

  router.delete(
    "/deleteBanner",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.deleteBanner),
    authController.deleteBanner

  )

  module.exports=router