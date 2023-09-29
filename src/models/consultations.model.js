import mongoose from "mongoose";
const consultationSchema = mongoose.Schema(
  {
    files: [{ file: { type: String }, fileType: { type: String } }],
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    designer: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    timeSlots: [{ type: String, required: true }],
    projectSummary: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    confirmSlotTime: { type: String },
    isConfirm: { type: Boolean, default: false },
    isPast: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Consultations = mongoose.model("consultations", consultationSchema);

export { Consultations };
