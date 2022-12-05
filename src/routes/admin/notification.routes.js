const express = require("express");
const { validate} = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/notification.validation");
const authController = require("../../controllers/admin/notification.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE,joi } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/create",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.createNotification),
    authController.createNotification
  );

  router.get(
    "/getAll",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.getAllNotification),
    authController.getAllNotification
  );

  router.put(
    "/editNotification",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.editNotification),
    authController.editNotification
  );

  router.delete(
    "/deleteNotification",
    auth(USER_TYPE.ADMIN),
    // validate(authValidation.deleteNotification),
    authController.deleteNotification
  );

  module.exports=router