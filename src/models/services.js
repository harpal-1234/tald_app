import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_TYPE, DEVICE_TYPE } from "../config/appConstants.js";

const servicesSchema = mongoose.Schema(
  {
    image: { type: String },
    description: { type: String },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Services = mongoose.model("services", servicesSchema);

export { Services };
