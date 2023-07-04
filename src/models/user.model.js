import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_TYPE, DEVICE_TYPE, BUSINESS } from "../config/appConstants.js";
// const { address } = require("./commonField.models");
//const { string } = require("joi");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    userName: { type: String },
    image: { type: String },
    dateOfBirth: { type: String },
    typeOfBusiness: { type: String, enum: [...Object.values(BUSINESS)] },
    businessName: { type: String },
    address: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
        required: true,
      },
    },
    city: { type: String },
    zipCode: { type: String },
    PhoneNumber: { type: String },
    operatingHours: { type: String },
    about: { type: String },
    websiteUrl: { type: String },
    coverImage: { type: String },
    // facebookId: { type: String },
    // appleId: { type: String },
    // googleId: { type: String },
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
