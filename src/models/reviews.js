import mongoose from "mongoose";
const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rating:{type:Number,required:true,default:0},
    reviewText:{type:String,required:true},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model("reviwes", reviewSchema);

export { Review };
