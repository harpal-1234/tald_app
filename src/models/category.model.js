const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const categorySchema = mongoose.Schema(
  {
    category:{type:String},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;