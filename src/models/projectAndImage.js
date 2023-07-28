import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  USER_TYPE,
  PROJECT_TYPE,
  FEE_STRUCTURE,
  OPTIONS,
  DEVICE_TYPE,
  BUSINESS,
  ABOUTUS,
  VALID_DAYS,
} from "../config/appConstants.js";

// const { address } = require("./commonField.models");
//const { string } = require("joi");

const projectSchema = mongoose.Schema(
  {
    images: [{ image: { type: String } }],
    projectName: { type: String },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

export { Project };
