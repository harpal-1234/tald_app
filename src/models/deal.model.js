const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { DEALS_SERVICE } = require("../config/appConstants");

const dealDate = mongoose.Schema(
  {
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false }
);
const dealSchema = mongoose.Schema(
  {
    storeId: { type: mongoose.SchemaTypes.ObjectId, ref: "stores" },
    dealId: { type: Number, default: "" },
    title: { type: String, default: "" },
    category: { type: String, enum: [...Object.values(DEALS_SERVICE)] },
    // name: { type: String, default: "" },
    totalPrice: { type: Number, default: "" },
    discountPrice: { type: Number, default: "" },
    description: { type: String, default: "" },
    inclusions: { type: String, default: "" },
    no_of_person: { type: String, default: "" },
    dealDate: [dealDate],
    gender: { type: String },
    status: {
      type: String,
      enum: ["activate", "deactivate"],
      default: "activate",
    },
    service: {
      category: { type: String, enum: [...Object.values(DEALS_SERVICE)] },
      categoryId: { type: String },
    },
    // quantity:{ type: Number, default: "" },
    validFrom: { type: Date },
    validTo: { type: Date },
    isActive: { type: Boolean, default: true },
    isPurchase: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model("deals", dealSchema);

module.exports = Deal;
