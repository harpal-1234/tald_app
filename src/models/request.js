import mongoose from "mongoose";
const requestSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: { type: Boolean, default: false },
    isReject: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Request = mongoose.model("request", requestSchema);

export { Request };
