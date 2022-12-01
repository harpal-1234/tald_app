const mongoose = require("mongoose");
const {DEALS_SERVICE} = require("../config/appConstants");

const storeSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "vendors",
      required: true,
    },
    storeName: { type: String, default: "" },
    service:{type: String, enum:[...Object.values(DEALS_SERVICE)]},
    location: {
      loc: {
        address: { type: String, default: "" },
        type: { type: String, default: "Point" },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({"location.loc": "2dsphere" });
const Store = mongoose.model("stores", storeSchema);

module.exports = Store;
