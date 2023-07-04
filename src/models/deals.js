import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_TYPE, DEVICE_TYPE,DAYS } from "../config/appConstants.js";
// const { address } = require("./commonField.models");
//const { string } = require("joi");

const dealsSchema = mongoose.Schema(
  {
    day: { type: String ,enum:[...Object.values(DAYS)]},
    startTime: { type: String },
    endTime: { type: String },
    deals:{type:String},
    price:{type:String},
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model("deals", dealsSchema);

export { Deal };
