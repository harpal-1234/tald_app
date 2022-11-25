const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
      required: true,
    },
    type: { type: String, default: "" },
    storeName: { type: String, default: "" },
    location: {
      address: { type: String, default: "" },
      loc: {
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
