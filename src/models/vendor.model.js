const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vendorAdminSchema = mongoose.Schema(
  {
    userName: { type: String },
    BusinessName:{ type: String },
    countryCode:{ type: String },
    phoneNumber:{ type: String },
    email: { type: String, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
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

vendorAdminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

vendorAdminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

const Vendor = mongoose.model("vendors", vendorAdminSchema);

module.exports = Vendor;