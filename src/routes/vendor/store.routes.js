const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const storeController = require("../../controllers/vendor/store.controller");
const storeValidation = require("../../validations/vendor/store.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

// router.post(
//     "/create",
//     auth(USER_TYPE.VENDOR_ADMIN),
//     validate(storeValidation.createStore),
//     storeController.createStore
//   );

  router.delete(
    "/deleteStore",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(storeValidation.deleteStore),
    storeController.deleteStore
  );

  router.get(
    "/vendorStoreName",
    auth(USER_TYPE.VENDOR_ADMIN),
    storeController.vendorStoreName
  );

  router.get(
    "/getDetails",
    auth(USER_TYPE.VENDOR_ADMIN),
    // validate(storeValidation.getStoreDetails),
    storeController.getStoreDetails
  )

  router.put(
    "/edit",
    auth(USER_TYPE.VENDOR_ADMIN),
    validate(storeValidation.editStoreDetails),
    storeController.editStoreDetails
  );

  router.get(
    "/getStoreCatgory",
    auth(USER_TYPE.VENDOR_ADMIN),
    storeController.getStoreCategory

  )



  module.exports=router
