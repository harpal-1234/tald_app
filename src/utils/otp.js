const config = require("../config/config");
// console.log(config)
// const dotenv = require("dotenv").config();
const accountSid = config.account_sid;
const authToken = config.Auth_Token;
const username = config.USER_NAME;
console.log(accountSid, authToken, username);
const client = require("twilio")(accountSid, authToken, username);
const otp = async (phoneNumber) => {
  //console.log(userBody.phoneNumber)
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  let otpExpires = new Date();
  otpExpires.setSeconds(otpExpires.getSeconds() + 240);
  //   const accountSid = process.env.Account_SID;
  // const authToken = process.env.Auth_Token;
  //const client = require('twilio')(accountSid, authToken);

  await client.messages
    .create({
      body: `Magentas_app OTP code is ${OTP}`,
      from: config.Twilio_Phone_Number,
      to: +919041725132,
    })
    .then((message) => console.log(message.sid));

  let otp = {};
  otp = { code: "", expiresAt: "" };
  otp.code = OTP;
  otp.expiresAt = otpExpires;

  return otp;
};

module.exports = { otp };
