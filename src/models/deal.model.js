const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {DEALS_SERVICE} = require("../config/appConstants");
const dealSchema = mongoose.Schema(
  {
    vendorId:{ type: mongoose.SchemaTypes.ObjectId,
      ref: "vendors"},
      storeId:{ type: mongoose.SchemaTypes.ObjectId,
        ref: "stores"},
    couponCode: { type: Number , default:""},
    category:{type: String, enum:[...Object.values(DEALS_SERVICE)]},
    name:{ type: String, default:""},
    worth: { type: Number, default:""},
    description: { type: String, default:""},
    status:{type: String,enum:["activate","deactivate"],default:"activate"},
    validFrom: { type:Date, default: false },
    validTo: { type: Date, default: false },
    isActive:{type: Boolean, default: true},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Deal = mongoose.model("deals", dealSchema);

module.exports = Deal;