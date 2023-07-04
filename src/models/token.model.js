import mongoose from "mongoose";
import  {
  TOKEN_TYPE,
  USER_TYPE,
  DEVICE_TYPE,
} from "../config/appConstants.js";

const tokenSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    admin: { type: mongoose.SchemaTypes.ObjectId, ref: "admins" },
    expires: { type: Date, required: true },
    token: { type: String, unique: true },
    role: { type: String, enum: [...Object.values(USER_TYPE)] },
    device: {
      type: {
        type: String,
        enum: [...Object.values(DEVICE_TYPE)],
      },
      token: { type: String },
    },
    isDeleted: { type: Boolean, default: false },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("token", tokenSchema);

export{Token};
