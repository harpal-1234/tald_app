const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
// const authValidation = require("../../validations/user/auth.validation");
const authController = require("../../controllers/user/deals.controllers");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/homeScreen",
    // validate(authValidation.signUp),
    authController.homeData
  )

module.exports=router