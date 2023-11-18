import mongoose from "mongoose";
const paymentsSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    designer: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    transitionId: { type: String, required: true },
    consultationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "consultations",
    },
    amount: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isRefund: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("payments", paymentsSchema);

export { Payment };
