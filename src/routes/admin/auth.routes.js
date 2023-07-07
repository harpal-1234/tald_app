import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
import authValidation from "../../validations/admin/auth.validation.js";
import * as authController from "../../controllers/admin/auth.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE } from "../../config/appConstants.js";

const router = express.Router();

router.post(
  "/login",
  validate(authValidation.adminLogin),
  authController.adminLogin
);
router.get(
  "/users",
  auth(USER_TYPE.ADMIN),
  validate(authValidation.getUsers),
  authController.userList
);
// router.put(
//   "/changePassword",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.changePassword),
//   authController.changePassword
// );

// router.post("/logout", auth(USER_TYPE.ADMIN), authController.adminLogout);
// router.get(
//   "/getDashboard",
//   auth(USER_TYPE.ADMIN),
//   // validate(authValidation.changePassword),
//   authController.dashBoard
// );
// router.post(
//   "/createGroup",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.createGroup),
//   authController.createGroup
// );
// router.get(
//   "/getGroup",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.getGroup),
//   authController.getGroup
// );
// router.get(
//   "/getUser",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.getUser),
//   authController.getUser
// );
// router.put(
//   "/userAction",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.userAction),
//   authController.userAction
// );
// router.delete(
//   "/deleteUser",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.userAction),
//   authController.userDelete
// );
// router.delete(
//   "/deleteGroup",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.deleteGroup),
//   authController.deleteGroup
// );
// router.get(
//   "/dashBoard",
//   auth(USER_TYPE.ADMIN),
//   //validate(authValidation.deleteGroup),
//   authController.dashBoard
// );
// router.get(
//   "/allUser",
//   auth(USER_TYPE.ADMIN),
//   validate(authValidation.allUser),
//   authController.allUser
// );
export default router;
