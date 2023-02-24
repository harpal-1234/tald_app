const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const dealController = require("../../controllers/vendor/deal.controller");
const dealValidation = require("../../validations/vendor/deal.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

router.post(
    "/create",
    auth(USER_TYPE.USER),
    validate(dealValidation.create),
    dealController.createDeal
  );

  router.put(
    "/edit",
    auth(USER_TYPE.USER),
    validate(dealValidation.editDeal),
    dealController.editDeal
  );


  router.get(
    "/getAll",
    auth(USER_TYPE.USER),
    validate(dealValidation.getAllDeal),
    dealController.getAllDeal
  );

  router.delete(
    "/deleteDeal",
    auth(USER_TYPE.USER),
    validate(dealValidation.deleteDeal),
    dealController.deleteDeal
  );


module.exports = router;