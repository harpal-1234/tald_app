const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { BANNER_STATUS } = require("../config/appConstants");

const notificationSchema = mongoose.Schema(
  {
    // vendorId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "vendor",
    //   required: true,
    // },
    storeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "stores",
      required: true,
    },
    image: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: ""},
    // viewedBy: { type: Array, default: [] },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification= mongoose.model("notifications", notificationSchema);

module.exports = Notification;
