import express from "express";
//import auth from "../middlewares/auth";
//import { USER_TYPE }  from "../../apiV1/config/appimportants");
const router = express.Router();

router.get("/termAndConditions", (req, res) => {
  return res.render("term&conditions");
});

router.get("/privacyPolicy", (req, res) => {
  return res.render("privacyPolicy");
});
export default router ;
