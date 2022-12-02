const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/user/deal.validation");
const authController = require("../../controllers/user/deal.controllers");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/homeScreen",
    auth(USER_TYPE.USER),
    // validate(authValidation.signUp),
    authController.homeData
  )
  
router.get(
  "/category",
  auth(USER_TYPE.USER),
  validate(authValidation.getCategoryData),
  authController.getCategoryData
)

router.get(
  "/services",
  auth(USER_TYPE.USER),
  // validate(authValidation.nearestService),
  authController.nearestService
)


module.exports=router