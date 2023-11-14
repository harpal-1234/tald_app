import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import authValidation from "../../validations/user/auth.validation.js";
import authController from "../../controllers/user/auth.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post("/signUp", validate(authValidation.signUp), authController.signUp);

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.get(
  "/verifyEmail",
  validate(authValidation.verifyEmail),
  authController.verifyMail
);
router.get(
  "/profile",
  validate(authValidation.verifyProfile),
  authController.profile
);
router.post("/login", validate(authValidation.login), authController.userLogin);
router.put(
  "/changePassword",
  auth(USER_TYPE.USER),
  validate(authValidation.changePassword),
  authController.changePassword
);
router.post(
  "/socialLogin",
  validate(authValidation.userSocialLogin),
  authController.userSocialLogin
);
router.post(
  "/forgotPassword",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/payment",
  auth(USER_TYPE.USER),
  validate(authValidation.payment),
  authController.payments
);
router.post("/webhook", authController.webhookApi);
router.post("/createSubscription", authController.createSubscription);
router.get(
  "/getPlans",
  auth(USER_TYPE.NON_USER),
  authController.getSubscription
);
router
  .route("/resetPassword")
  .get(authController.forgotPage)
  .post(
    validateView(
      validateView(authValidation.forgotPage),
      authValidation.resetForgotPassword
    ),
    authController.resetForgotPassword
  );

router.post("/logout", auth(USER_TYPE.USER), authController.userLogout);
router.post(
  "/createService",
  auth(USER_TYPE.USER),
  validate(authValidation.createServices),
  authController.createService
);
router.put(
  "/editProfile",
  auth(USER_TYPE.USER),
  validate(authValidation.editProfile),
  authController.editProfile
);
router.get(
  "/getfilter",
  auth(USER_TYPE.NON_USER),
  validate(authValidation.filters),
  authController.getFilter
);
router.get(
  "/getProfile",
  auth(USER_TYPE.USER),
  //validate(authValidation.getProfile),
  authController.getProfile
);
router.get(
  "/stripeConnectLink",
  auth(USER_TYPE.USER),
  //validate(authValidation.getProfile),
  authController.createStripeConnectLink
);
router.get(
  "/return",
  //auth(USER_TYPE.USER),
  //validate(authValidation.getProfile),
  authController.returnUrl
);
router.get(
  "/checkOutSession",
  auth(USER_TYPE.USER),
  validate(authValidation.priceId),
  authController.checkOutSession
);
router.get(
  "/getSubscription",
  auth(USER_TYPE.USER),
  // validate(authValidation.priceId),
  authController.getDesignerSubscription
);
router.get(
  "/splitCheckout",
  auth(USER_TYPE.USER),
  // validate(authValidation.priceId),
  authController.splitCheckout
);
export default router;
