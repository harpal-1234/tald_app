const express = require("express");
const { validate,validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/deal.validation");
const authController = require("../../controllers/admin/deal.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");


const router = express.Router();



  router.post(
    "/addCategory",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.addCategory),
    authController.addCategory
  );

  router.delete(
    "/deleteCategory",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.deleteCategory),
    authController.deleteCategory

  )


  router.get(
    "/getAllCategory",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.deleteCategory),
    authController.getAllCategory

  );

  router.get(
    "/getAllDeal",
    auth(USER_TYPE.ADMIN),
    authController.getAllDeal
  )

  

  module.exports=router