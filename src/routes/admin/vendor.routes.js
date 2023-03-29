const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/admin/vendor.validation");
const authController = require("../../controllers/admin/vendor.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.post("/create", 
   auth(USER_TYPE.ADMIN), 
  authController.createVendor
);

router.get(
  "/getAll",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getAllVendor),
  authController.getAllVendor
);
router.get(
  "/vendorDeals",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getVendorDetails),
  authController.vendorDetails
);
router.put(
  "/editProfile",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.editVendorProfile),
  authController.editVendorProfile
);

router.delete(
  "/delete",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.deleteVendor),
  authController.deleteVendor
);
router.put(
  "/block",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.deleteVendor),
  authController.blockVendor
);
module.exports = router;
