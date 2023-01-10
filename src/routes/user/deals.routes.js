const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/user/deal.validation");
const authController = require("../../controllers/user/deal.controllers");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();

router.get(
    "/homeData",
    auth(USER_TYPE.USER),
    // validate(authValidation.signUp),
    authController.homeData
  )
  
router.get(
  "/getCategory",
  auth(USER_TYPE.USER),
  validate(authValidation.getCategoryData),
  authController.getCategoryData
)

router.get(
  "/services",
  auth(USER_TYPE.USER),
  validate(authValidation.nearestService),
  authController.nearestService
)
router.post(
  "/purchase",
  auth(USER_TYPE.USER),
  validate(authValidation.purchaseDeal),
  authController.purchaseDeal
)

router.get(
  "/storeDeal",
  auth(USER_TYPE.USER),
  validate(authValidation.storeDeal),
  authController.storeDeal
);

router.get(
  "/categoryData",
  auth(USER_TYPE.USER),
  validate(authValidation.categoryData),
  authController.categoryData
);


router.post(
  "/favourites",
  auth(USER_TYPE.USER),
  validate(authValidation.favouriteStore),
  authController.favouriteStore
);




module.exports=router