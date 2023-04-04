const mongoose = require("mongoose");
const { DEALS_SERVICE } = require("../config/appConstants");
const bcrypt = require("bcryptjs");

const storeSchema = mongoose.Schema(
  {
    // vendorId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "vendors",
    //   required: true,
    // },
    storeImage: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true, unique: true },
    businessName: { type: String, default: "" },
    website: { type: String, default: "" },
    vendor: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    service: {
      category: { type: String, enum: [...Object.values(DEALS_SERVICE)] },
      categoryId: { type: String },
    },

    loc: {
      address: { type: String, default: "" },
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    deals: [{ type: mongoose.SchemaTypes.ObjectId, ref: "deals" }],
    purchasedCount: { type: Number,default:0 },
    about: { type: String },
    type: { type: String },
    description: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    phoneNumber: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    totalDeals:{type:Number,default:0},
    totalRevenue:{type:Number,default:0},
    rating:{type:Number,default:0},
    userRating:[{
      userId:{ type: mongoose.SchemaTypes.ObjectId, ref: "user" },
      rating:{type:Number}
    }]
  },
  {
    timestamps: true,
  }
);

storeSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

storeSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

storeSchema.index({ loc: "2dsphere" });
const Store = mongoose.model("stores", storeSchema);

module.exports = Store;
