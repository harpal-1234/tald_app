const { string } = require("joi");
const mongoose = require("mongoose");
const { TOKEN_TYPE, USER_TYPE } = require("../config/appConstants");

const notificationSchema = mongoose.Schema(
  {
    message: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    type: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    isSeen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Notifications = mongoose.model("notification", notificationSchema);

module.exports = Notifications;
