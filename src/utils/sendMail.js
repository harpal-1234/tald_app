const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const dotenv=require('dotenv');
dotenv.config();
// const config = require("../config/config");

var resetPassword = fs.readFileSync(
  path.join(__dirname, "../../views/email/resetPassword.hbs"),
  "utf8"
);

var resetPasswordTemplate = Handlebars.compile(resetPassword);

var verify = fs.readFileSync(
  path.join(__dirname, "../../views/email/verifyAccount.hbs"),
  "utf8"
);

console.log("working in semdmail")
var verifyAccountTemplate = Handlebars.compile(verify);

try {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  function forgotPasswordEmail(email, token) {
  
    return new Promise((resolve, reject) => {
      var info = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Reset Password",
        // attachments: [
        //   {
        //     filename: "logo.png",
        //     path: __dirname + "/images/logo.png",
        //     cid: "logo",
        //   },
        // ],
        html: resetPasswordTemplate({
          token,
          apiBaseUrl: process.env.ForgotPassword,
          title: "Forgot Password",
        }),
      };
     
      transporter.sendMail(info, (error, accept) => {
        if (error) {
          reject(error);
        }
        resolve(accept, console.log("Mail Sended"));
      });
    });
  }


  function verifyAccount(email,token) {
    console.log(email,"second call");
    return new Promise((resolve, reject) => {
      var info = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify Account",
        html: verifyAccountTemplate({
          title: "Verification",
          token,
          apiBaseUrl: process.env.ForgotPassword,
        }),
      };

      transporter.sendMail(info, (error, accept) => {
        if (error) {
          reject(error);
        }
        resolve(accept, console.log("Mail Sended"));
      });
    });
  }
} catch (err) {
  throw err;
}

module.exports = { forgotPasswordEmail, verifyAccount };