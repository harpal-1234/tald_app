import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import dotenv from "dotenv";
dotenv.config();
// const config from "../config/config");
const __dirname = path.resolve();
var resetPassword = fs.readFileSync(
  path.join(__dirname, "views/email/resetPassword.hbs"),
  "utf8"
);

var resetPasswordTemplate = Handlebars.compile(resetPassword);

var verifymail = fs.readFileSync(
  path.join(__dirname, "views/verifyEmail.hbs"),
  "utf8"
);

var verify = fs.readFileSync(
  path.join(__dirname, "views/email/verifyAccount.hbs"),
  "utf8"
);
var verifyMailTemplate = Handlebars.compile(verifymail);
var verifyAccountTemplate = Handlebars.compile(verify);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});
export const verifyEmail = async (email, token) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Email",
      // attachments: [
      //   {
      //     filename: "logo.png",
      //     path: __dirname + "/images/logo.jpg",
      //     cid: "logo",
      //   },
      // ],
      html: verifyMailTemplate({
        email,
        token,
        apiBaseUrl: process.env.ForgotPassword,
        title: "Verify Email",
      }),
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
export const forgotPasswordEmail = async (email, token) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    const info = {
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
};

export const contactUs = async (name, body, email) => {
  console.log(name, body, email);
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL,
      subject: "Contact Us Report",
      html: `<b><span>Name:</span></b><span>${name}</span><b><br><br><span>Email:</span></b>${email}<br><br><b><span>Message:</span></b>${body}`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};

export const verifyAccount = (email, token) => {
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
};
