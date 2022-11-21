const mongoose = require("mongoose");
const {
  TOKEN_TYPE,
  USER_TYPE,
} = require("../config/appConstants");

const tokenSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    admin: { type: mongoose.SchemaTypes.ObjectId, ref: "admins" },
    vendor:{ type: mongoose.SchemaTypes.ObjectId, ref: "vendors"},
    expires: { type: Date, required: true },
    token: { type: String, unique: true},
    role: { type: String, enum: [...Object.values(USER_TYPE)]  },
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

module.exports = Token;