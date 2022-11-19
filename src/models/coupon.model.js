const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const couponSchema = mongoose.Schema(
  {
    couponCode: { type: String },
    name:{ type: String, default:""},
    worth: { type: String, default:""},
    description: { type: String, default:""},
    validFrom: { type:Date, default: false },
    validTo: { type: Date, default: false },
  },
  {
    timestamps: true,
  }
);


const Coupon = mongoose.model("coupons", couponSchema);

module.exports = Coupon;