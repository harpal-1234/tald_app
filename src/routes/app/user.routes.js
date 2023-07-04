import express from "express";
import { validate, validateView } from "../../middlewares/validate.js";
//import userValidation from "../../validations/app/user.validation.js";
import * as userController from "../../controllers/app/user.controller.js";
import auth from "../../middlewares/auth.js";
import { USER_TYPE} from "../../config/appConstants.js";

const router = express.Router();

router.get(
  "/get",
  auth(USER_TYPE.USER),
  //validate(userValidation.getUser),
  userController.getUser
);

export default router ;
