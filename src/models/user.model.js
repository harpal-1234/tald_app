import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  USER_TYPE,
  DEVICE_TYPE,
  BUSINESS,
  ABOUTUS,
  VALID_DAYS,
} from "../config/appConstants.js";
// const { address } = require("./commonField.models");
//const { string } = require("joi");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
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

// userSchema.pre("save", async function (next) {
//   const user = this;

//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   console.log(password, user.password);
//   console.log(await bcrypt.compare(password, user.password));
//   return bcrypt.compare(password, user.password);
// };

//userSchema.index({ location: "2dsphere" });
const User = mongoose.model("user", userSchema);

export { User };
