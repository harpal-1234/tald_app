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
var verifyEditProfile = fs.readFileSync(
  path.join(__dirname, "views/editProfile.hbs"),
  "utf8"
);
var addVendor = fs.readFileSync(
  path.join(__dirname, "views/vendorInfo.hbs"),
  "utf8"
);
var verifyMailTemplate = Handlebars.compile(verifymail);
var verifyAccountTemplate = Handlebars.compile(verify);
var editProfileTemplate = Handlebars.compile(verifyEditProfile);
var vendorTemplate = Handlebars.compile(addVendor);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});
export const createVendorMail = (email, password, name) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Tald",
      html: vendorTemplate({
        // title: "Verification",
        email,
        password,
        name,
        // apiBaseUrl: process.env.ForgotPassword,
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
export const verifyEmail = async (email, token) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Email",
      html: verifyMailTemplate({
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
export const editProfile = (email, token, name) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Account",
      html: editProfileTemplate({
        title: "Verification",
        token,
        apiBaseUrl: process.env.ForgotPassword,
        name,
        email,
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
export const cancelBooking = async (consultationId, name, reason, email) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Cancel Consultation Booking",
      html: `<b><span>message:</span></b><span>${name} canceled Your Booking </span><b><br><span>consultationId:</span></b><span>${consultationId}</span><b><br><br><span>name:</span></b>${name}<br><br><b><span>reason:</span></b>${reason}`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
export const acceptBooking = async (consultationId, name, email) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Accept Consultation Booking",
      html: `<b><span>message:</span></b><span>${name} Accept Your Consultation Booking </span><b><br><span>consultationId:</span></b><span>${consultationId}</span><b><br><br><span>name:</span></b>${name}<br>`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
export const InqueryBooking = async (Id, message, email) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Accept Consultation Booking",
      html: `<b><span>message:</span></b><span>${message}</span><b><br><span>consultationId:</span></b><span>${Id}</span><b>`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
export const rescheduledBookConsultationsBookingClient = async (
  consultationId,
  name,
  email
) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Cancel Consultation Booking",
      html: `<b><span>message:</span></b><span>${name} rescheduled a  consultation  </span><b><br><span>consultationId:</span></b><span>${consultationId}</span><b><br><br><span>name:</span></b>${name}<br><br><b>`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
export const rescheduledBookConsultationsBookingDesigner = async (
  consultationId,
  name,
  email,
  link
) => {
  return new Promise((resolve, reject) => {
    var info = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Cancel Consultation Booking",
      html: `<b><span>message:</span></b><span>${name} want to rescheduled a  consultation  </span><b><br><span>consultationId:</span></b><span>${consultationId}</span><b><br><span>name:</span></b>${name}<br><br>please click below link<br><br>${link}`,
    };

    transporter.sendMail(info, (error, accept) => {
      if (error) {
        reject(error);
      }
      resolve(accept, console.log("Mail Sended"));
    });
  });
};
