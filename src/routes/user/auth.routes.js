import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import authValidation from "../../validations/user/auth.validation.js";
import authController from "../../controllers/user/auth.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post(
  "/signUp",
 // auth(USER_TYPE.USER),
  validate(authValidation.signUp),
  authController.signUp
);

router.post("/login", validate(authValidation.login), authController.userLogin);

router.post(
  "/socialLogin",
  validate(authValidation.userSocialLogin),
  authController.userSocialLogin
);

// router.get("/getProfile", auth(USER_TYPE.USER), authController.getProfile);

router.put(
  "/changePassword",
  auth(USER_TYPE.USER),
  validate(authValidation.changePassword),
  authController.changePassword
);

router.put(
  "/editProfile",
  auth(USER_TYPE.USER),
  validate(authValidation.editprofile),
  authController.editProfile
)

// router.post(
//   "/refreshToken",
//   validate(authValidation.refreshToken),
//   authController.refreshToken
// );

//--------forgot password--------------//

router.post(
  "/forgotPassword",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
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

// //----------end------------------//

router.post(
  "/logout",
  auth(USER_TYPE.USER),
  //(authValidation.logOut),
  authController.userLogout
);

router.post(
  "/contactUs",
  auth(USER_TYPE.USER),
  validate(authValidation.contactUs),
  authController.userContactUs
);
// router.get("/getCustomerList", auth(USER_TYPE.USER), authController.getCustomerList);

// router.get("/dashBoard",auth(USER_TYPE.USER), authController.dashBoard);

// router.delete("/deleteAccount", auth(USER_TYPE.USER), authController.deleteAccount);

// router.delete("/deleteImage",auth(USER_TYPE.USER),authController.deleteImage);

export default router;