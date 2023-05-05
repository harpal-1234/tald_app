const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const userValidation = require("../../validations/app/user.validation");
const userController = require("../../controllers/app/user.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.get(
  "/get",
  auth(USER_TYPE.USER),
  validate(userValidation.getUser),
  userController.getUser
);
router.put(
  "/filter",
  auth(USER_TYPE.USER),
  validate(userValidation.filter),
  userController.filter
);
router.put(
  "/seeDistance",
  auth(USER_TYPE.USER),
  validate(userValidation.seeDistance),
  userController.seeDistance
);
router.put(
  "/likeAndDislike",
  auth(USER_TYPE.USER),
  validate(userValidation.likeAndDislike),
  userController.likeAndDislike
);
router.get(
  "/notifications",
  auth(USER_TYPE.USER),
  validate(userValidation.notifications),
  userController.notification
);
router.get(
  "/conversations",
  auth(USER_TYPE.USER),
  validate(userValidation.notifications),
  userController.conversation
);
module.exports = router;
