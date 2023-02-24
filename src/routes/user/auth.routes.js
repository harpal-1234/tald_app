const express = require("express");
const { validate, validateView } = require("../../middlewares/validate");
const authValidation = require("../../validations/user/auth.validation");
const authController = require("../../controllers/user/auth.controller");
const auth = require("../../middlewares/auth");
const { USER_TYPE, joi } = require("../../config/appConstants");

const router = express.Router();

router.post("/signUp", validate(authValidation.signUp), authController.signUp);

router.post("/login", validate(authValidation.login), authController.userLogin);

router.post(
  "/socialLogin",
  validate(authValidation.userSocialLogin),
  authController.userSocialLogin
);

// router.get("/getProfile", auth(USER_TYPE.USER), authController.getProfile);

// router.put(
//   "/changePassword",
//   auth(USER_TYPE.USER),
//   validate(authValidation.changePassword),
//   authController.changePassword
// );

// router.put(
//   "/editProfile",
//   auth(USER_TYPE.USER),
//   upload.uploadFile.single('profileImage'),
//   validate(authValidation.editprofile),
//   authController.editProfile
// )

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
  validate(authValidation.logOut),
  authController.userLogout
);

router.get(
  "/pushNotification",
  auth(USER_TYPE.USER),
  // validate(authValidation.pushNotificationStatus ),
  authController.pushNotification
);

// router.get("/getCustomerList", auth(USER_TYPE.USER), authController.getCustomerList);

// router.get("/dashBoard",auth(USER_TYPE.USER), authController.dashBoard);

// router.delete("/deleteAccount", auth(USER_TYPE.USER), authController.deleteAccount);

// router.delete("/deleteImage",auth(USER_TYPE.USER),authController.deleteImage);

module.exports = router;
