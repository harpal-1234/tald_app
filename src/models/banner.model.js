const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { BANNER_STATUS,DEALS_SERVICE } = require("../config/appConstants");

const bannerSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
      required: true,
    },
    store: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "stores",
      required: true,
    },
    image: { type: String, default: "" },
    service:{
      category:{type: String, enum:[...Object.values(DEALS_SERVICE)]},
      categoryId:{type:String}
    },
    title: { type: String, default: "" },
    // description: { type: String, default: "" },
    webLink: { type: String, default: "" },
    // viewedBy:{type:Array,default:[]},
    // status:{type:String, enum: [...Object.values(BANNER_STATUS)] ,default:"pending"},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banners", bannerSchema);

module.exports = Banner;
