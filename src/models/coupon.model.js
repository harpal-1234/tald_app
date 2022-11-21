const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const couponSchema = mongoose.Schema(
  {
    vendorId:{ type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
      required: true},
    couponCode: { type: String , default:""},
    name:{ type: String, default:""},
    worth: { type: Number, default:""},
    description: { type: String, default:""},
    validFrom: { type:Date, default: false },
    validTo: { type: Date, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Coupon = mongoose.model("coupons", couponSchema);

module.exports = Coupon;