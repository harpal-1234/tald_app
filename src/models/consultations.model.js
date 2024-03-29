import mongoose from "mongoose";
const consultationSchema = mongoose.Schema(
  {
    files: [{ file: { type: String }, fileType: { type: String } }],
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    designer: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    timeSlots: [{ type: String, required: true }],
    projectSummary: { type: String },
    confirmSlotTime: { type: String },
    isPayment: { type: Boolean, default: false },
    durationTime: { type: String, required: true },
    zoomMeetingLink: { type: String },
    isConfirm: { type: Boolean, default: false },
    isPast: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isCancel: { type: Boolean, default: false },
    isReschedule: { type: Boolean, default: false },
    reason: { type: String },
    canceledBy: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const Consultations = mongoose.model("consultations", consultationSchema);

export { Consultations };
