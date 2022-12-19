const express = require("express");
const router = express.Router();
const auth=require("../middlewares/auth");
const {USER_TYPE}=require("../config/appConstants");

router.get("/termAndConditions",(req, res) => {
  return res.render("term&conditions");
});

router.get("/privacyPolicy",(req, res) => {
  return res.render("privacypolicy");
});
module.exports = router;