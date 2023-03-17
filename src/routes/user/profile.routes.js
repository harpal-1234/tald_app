const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/user/profile.validation");
const authController = require("../../controllers/user/profile.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.put(
  "/editProfile",
  auth(USER_TYPE.USER),
  validate(authValidation.editprofile),
  authController.editProfile
);

router.put(
  "/changePassword",
  auth(USER_TYPE.USER),
  validate(authValidation.changePassword),
  authController.changePassword
);

router.post(
  "/contactUs",
  auth(USER_TYPE.USER),
  validate(authValidation.userContactUs),
  authController.userContactUs
);

router.post(
  "/pushNotificationStatus",
  auth(USER_TYPE.USER),
  authController.pushNotificationStatus
);

router.post(
  "/userLocation",
  auth(USER_TYPE.USER),
  // validate(authValidation.userLocation),
  authController.userLocation
);

router.post(
  "/userLocation",
  auth(USER_TYPE.USER),
  // validate(authValidation.userLocation),
  authController.userLocation
);



router.get(
  "/myFavourites",
  auth(USER_TYPE.USER),
  // validate(authValidation.userLocation),
  authController.myFavourites
);


router.get(
  "/purchaseData",
  auth(USER_TYPE.USER),
  // validate(authValidation.userLocation),
  authController.dealPurchaseData
);

router.get(
  "/favouriteStoreDeal",
  auth(USER_TYPE.USER),
  validate(authValidation.favouriteStoreDeal),
  authController.favouriteStoreDeal
);
router.get(
  "/getNotification",
  auth(USER_TYPE.USER),
  //validate(authValidation.favouriteStoreDeal),
  authController.notification
);
module.exports = router;
