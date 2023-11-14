import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    requests: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    membershipRevenue:{type:Number,default:0},
    consultationRevenue:{type:Number,default:0}
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

export { Admin };
