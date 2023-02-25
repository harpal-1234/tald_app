const express = require("express");
const auth = require("../middlewares/auth");
//const { USER_TYPE } = require("../../apiV1/config/appConstants");
const router = express.Router();

router.get("/termAndConditions",(req, res) => {
  return res.render("term&conditions");
});

router.get("/privacyPolicy",(req, res) => {
  return res.render("privacyPolicy");
});
module.exports = router;
