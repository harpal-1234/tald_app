const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/store.validation");
const authController = require("../../controllers/admin/store.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.get(
  "/getAll",
  auth(USER_TYPE.ADMIN),
  // validate(authValidation.getAllNotification),
  authController.getAllStore
);

router.get(
    "/getStoreDeal",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.getStoreDeal),
    authController.getStoreDeals
  );


  router.delete(
    "/deleteStore",
    auth(USER_TYPE.ADMIN),
    validate(authValidation.deleteStore),
    authController.deleteStore
  );



module.exports = router;
