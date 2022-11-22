const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const couponController = require("../../controllers/vendor/coupon.controller");
const couponValidation = require("../../validations/vendor/coupon.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/create",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(couponValidation.create),
    couponController.createCoupon
  );


  router.get(
    "/getAllCoupon",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(couponValidation.getAllCoupon),
    couponController.getAllCoupon
  );

  router.delete(
    "/deleteCoupon",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(couponValidation.deleteCoupon),
    couponController.deleteCoupon
  );


module.exports = router;