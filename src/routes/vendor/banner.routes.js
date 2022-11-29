const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const bannerValidation = require("../../validations/vendor/banner.validation");
const bannerController = require("../../controllers/vendor/banner.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
  "/create",
  auth(USER_TYPE.VENDOR_ADMIN),
  validate(bannerValidation.createBanner),
  bannerController.createBanner
);

router.post(
    "/editBanner",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(bannerValidation.editBanner),
    bannerController.editBanner
  );

  router.get(
    "/getBanner",
    auth(USER_TYPE.VENDOR_ADMIN),
    // validate(bannerValidation.getBanner),
    bannerController.getBanner
  );
  

  router.delete(
    "/deleteBanner",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(bannerValidation.deleteBanner),
    bannerController.deleteBanner
  );

  router.post(
    "/request",
    auth(USER_TYPE.VENDOR_ADMIN),
    // validate(bannerValidation.createBanner),
    bannerController.bannerRequest
  );

module.exports=router