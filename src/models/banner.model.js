const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {BANNER_STATUS}=require("../config/appConstants")

const bannerSchema = mongoose.Schema(
  {
    vendorId:{ type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
      required: true},
    image: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    webLink: { type: String, default: "" },
    viewedBy:{type:Array,default:[]},
    status:{type:String, enum: [...Object.values(BANNER_STATUS)] ,default:"pending"},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banners", bannerSchema);

module.exports = Banner;
