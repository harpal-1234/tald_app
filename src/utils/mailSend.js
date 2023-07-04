import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import dotenv from "dotenv";
dotenv.config();
// const config  from "../config/config");

var resetPassword = fs.readFileSync(
  path.join(__dirname, "../../views/vendorEmail/resetPassword.hbs"),
  "utf8"
);

var resetPasswordTemplate = Handlebars.compile(resetPassword);

var verify = fs.readFileSync(
  path.join(__dirname, "../../views/vendorEmail/verifyAccount.hbs"),
  "utf8"
);

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

  function contactUs(body, email) {
    return new Promise((resolve, reject) => {
      var info = {
        from: process.env.SENDER_EMAIL,
        to: process.env.SENDER_EMAIL,
        subject: "Contact Us Report",
        html: `<b><span>Name:</span></b><span>${name}</span><b><br><br><span>Email:</span></b>${email}<br><br><b><span>Message:</span></b>${data1}`,
      };

      transporter.sendMail(info, (error, accept) => {
        if (error) {
          reject(error);
        }
        resolve(accept, console.log("Mail Sended"));
      });
    });
  }

  function verifyAccount(email, token) {
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

export { forgotPasswordEmail, verifyAccount, contactUs };
