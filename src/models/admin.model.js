const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = mongoose.Schema(
  {
    // name: { type: String },
    email: { type: String, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    orders: [
      {
        vendor: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
        amount: {type:String},
        bannerId:{type: mongoose.SchemaTypes.ObjectId, ref: "banners"}
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;
