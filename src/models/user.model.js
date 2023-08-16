import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  USER_TYPE,
  PROJECT_TYPE,
  FEE_STRUCTURE,
  OPTIONS,
} from "../config/appConstants.js";
// const { address } = require("./commonField.models");
//const { string } = require("joi");
const dateAndTime = mongoose.Schema(
  {
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: Boolean, default: false },
  },
  { _id: false }
);
const userSchema = mongoose.Schema(
  {
    email: { type: String },
    name: { type: String },
    password: { type: String },
    isBlocked: { type: Boolean, default: false },
    type: { type: String, enum: [...Object.values(USER_TYPE)] },
    googleId: { type: String },
    companyName: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
        required: true,
      },
    },
    address: { type: String },
    instagramLink: { type: String },
    pinterestLink: { type: String },
    about: { type: String },
    projectType: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(PROJECT_TYPE)] },
    },
    virtual_Consultations: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(OPTIONS)] },
      chargers_25_mins: { type: String },
      chargers_55_mins: { type: String },
    },
    newClientProjects: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(OPTIONS)] },
      chargers_25_mins: { type: String },
      chargers_55_mins: { type: String },
    },
    destinationProject: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(OPTIONS)] },
      chargers_25_mins: { type: String },
      chargers_55_mins: { type: String },
    },
    feeStructure: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(FEE_STRUCTURE)] },
    },
    tradeDiscount: {
      question: { type: String },
      answer: { type: String, enum: [...Object.values(OPTIONS)] },
    },
    minBudget: { type: String },
    maxBudget: { type: String },
    weeklySchedule: [dateAndTime],
    availability: {
      startDate: { type: String },
      endDate: { type: String },
    },
    isSignUp:{ type: Boolean, default: false },
    isIndefinitely: { type: Boolean, default: false },
    inviteesSchedule: { type: Number },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const emplyee = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!userSchema;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  console.log(password, user.password);
  console.log(await bcrypt.compare(password, user.password));
  return bcrypt.compare(password, user.password);
};

userSchema.index({ location: "2dsphere" });
const User = mongoose.model("user", userSchema);

export { User };
