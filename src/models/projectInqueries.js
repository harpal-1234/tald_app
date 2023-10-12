import mongoose from "mongoose";
import {
  PROJECT_TYPE,
  OPTIONS,
  STATUS,
  KIND_OF_ASSITANCE,
} from "../config/appConstants.js";

const projectInquerySchema = mongoose.Schema(
  {
    files: [{ file: { type: String }, fileType: { type: String } }],
    projectName: { type: String },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    designer: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    projectType: {
      type: String,
      required: true,
      enum: [...Object.values(PROJECT_TYPE)],
    },
    kindOfAssistance: {
      type: String,
      required: true,
      enum: [...Object.values(KIND_OF_ASSITANCE)],
    },
    projectSummary: { type: String, required: true },
    address: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
        // required: true,
      },
    },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    projectFund: { type: Number, required: true },
    primaryDecisionMaker: { type: String, enum: [...Object.values(OPTIONS)] },
    workedWithInteriorDesigner: {
      type: String,
      enum: [...Object.values(OPTIONS)],
    },
    involvedYourProject: { type: String, required: true },
    status: {
      type: String,
      default: STATUS.PENDING,
      enum: [...Object.values(STATUS)],
    },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const ProjectInquery = mongoose.model("projectInqueries", projectInquerySchema);

export { ProjectInquery };
