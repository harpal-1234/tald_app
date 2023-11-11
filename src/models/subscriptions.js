import mongoose from "mongoose";
const subscriptionSchema = mongoose.Schema(
  {
    designer: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    transitionId: { type: String, required: true },
    startDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },
    amount: { type: String, required: true },
    currentPlan: { type: String, required: true },
    billingCycle: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Subscriptions = mongoose.model("subscriptions", subscriptionSchema);

export { Subscriptions };
