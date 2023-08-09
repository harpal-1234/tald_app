import mongoose from "mongoose";
const projectSchema = mongoose.Schema(
  {
    images: [{ image: { type: String } }],
    projectName: { type: String },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

export { Project };
