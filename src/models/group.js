const { string } = require("joi");
const mongoose = require("mongoose");
const { TOKEN_TYPE, USER_TYPE, REQUEST } = require("../config/appConstants");

const groupSchema = mongoose.Schema(
  {
    groupName: { type: String, required: true },
    groupMember: [{ type: mongoose.Schema.Types.ObjectId }],
    text: { type: String, required: true },

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
const groups = mongoose.model("group", groupSchema);

module.exports = groups;
