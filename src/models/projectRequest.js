import mongoose from "mongoose";
import { STATUS } from "../config/appConstants.js";
const projectRquestSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projectInqueries",
    },
    isVerify: { type: Boolean, default: false },
    isReject: { type: Boolean, default: false },
    status: {
      type: String,
      default: STATUS.PENDING,
      enum: [...Object.values(STATUS)],
    },
    inqueryTime: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const projectRequest = mongoose.model("projectRequests", projectRquestSchema);

export { projectRequest };
