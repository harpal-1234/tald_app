const mongoose = require("mongoose");
const {DEALS_SERVICE} = require("../config/appConstants");
const bcrypt = require("bcryptjs");

const storeSchema = mongoose.Schema(
  {
    // vendorId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "vendors",
    //   required: true,
    // },
    storeImage: { type: String,default:''},
    email: { type: String, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, default: "" },
    storeType: { type: String, default: "" },
    service:{
      category:{type: String, enum:[...Object.values(DEALS_SERVICE)]},
      categoryId:{type:String}
    },
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
    // deals:[{type: mongoose.SchemaTypes.ObjectId,
    //   ref: "deals",
    //   }],
    about: { type: String},
    type:{ type: String},
    description:{ type: String, default: "" },
    countryCode:{ type: String, default: "" },
    phoneNumber:{ type: String},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
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

storeSchema.index({"location.loc": "2dsphere" });
const Store = mongoose.model("stores", storeSchema);

module.exports = Store;
