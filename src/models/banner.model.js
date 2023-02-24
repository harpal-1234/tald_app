const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  BANNER_STATUS,
  DEALS_SERVICE,
  BANNER_TYPE,
} = require("../config/appConstants");
const { number } = require("joi");

const bannerSchema = mongoose.Schema(
  {
    storeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "stores",
    },
    bannerId:{type:String,required:true},
    image: { type: String, default: "" },
    service: {
      category: { type: String, enum: [...Object.values(DEALS_SERVICE)] },
      categoryId: { type: String },
    },
    title: { type: String, default: "" },
    stores: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "stores",
      },
    ],
    startDate:{type:Date},
    endDate:{type:Date},
    type: { type: String, enum: [...Object.values(BANNER_TYPE)] },
    // description: { type: String, default: "" },
    // webLink: { type: String, default: "" },
    // viewedBy:{type:Array,default:[]},
    status: {
      type: String,
      enum: [...Object.values(BANNER_STATUS)],
      default: "activate",
    },
    expireStatus: {
      type: String,
      enum: [...Object.values(BANNER_STATUS)],
      default: "activate",
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banners", bannerSchema);

module.exports = Banner;
