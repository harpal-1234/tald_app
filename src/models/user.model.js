const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  WORK_TYPE,
  USER_TYPE,
  JOB_TITLE,
  PUSH_NOTIFICATION_STATUS,
  NOTIFICATION_STATUS,
} = require("../config/appConstants");
// const { address } = require("./commonField.models");
const { string } = require("joi");

const userSchema = mongoose.Schema(
  {
    // email:{type:String,required:true},
    name: { type: String, default: "" },
    password: { type: String, default: "" },
    type: { type: String, required: true },
    stripeId:{type:String},
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      default: "",
    },
    location: {
      address: { type: String, default: "" },
      loc: {
        type: { type: String, default: "Point" },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    }, //logitude and latitude
    dealPurchases: [
      {
        storeId: { type: mongoose.SchemaTypes.ObjectId, ref: "stores" },
        orderDate: { type: String },
        orderTime: { type: String },
        deals: [
          {
            dealId: { type: mongoose.SchemaTypes.ObjectId, ref: "deals" },
            quantity: { type: Number },
            finalprice: { type: Number },
          },
        ],
        PurchasedId: { type: String },
        paymentId:{type:String},
        billDetails: {
          total: { type: Number },
          tax: { type: Number },
          amountPayable: { type: Number },
        },
        rating:{type:Number,default:0},
        isRating:{type:Boolean,default:false}
      },
    ],
    orders: [
      {
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
        storeId: { type: mongoose.SchemaTypes.ObjectId, ref: "stores" },
        orderDate: { type: String },
        orderTime: { type: String },
        deals: [
          {
            dealId: { type: mongoose.SchemaTypes.ObjectId, ref: "deals" },
            quantity: { type: Number },
            finalprice: { type: Number },
          },
        ],
        PurchasedId: { type: String },
        paymentId:{type:String},
        billDetails: {
          total: { type: Number },
          tax: { type: Number },
          amountPayable: { type: Number },
        },
      },
    ],
    favouriteStores: [{ type: mongoose.SchemaTypes.ObjectId, ref: "stores" }], //passing like storeId
    recentlyView: [{ type: mongoose.SchemaTypes.ObjectId, ref: "stores" }],
    phoneNumber: { type: String, default: "" },
    socialId: { type: String, default: "" },
    isPushNotification: { type: Boolean, default: false },
    isNotification: {
      type: String,
      enum: [...Object.values(NOTIFICATION_STATUS)],
      default: NOTIFICATION_STATUS.ENABLE,
    },
    addCard: [
      {
        dealId: { type: mongoose.SchemaTypes.ObjectId, ref: "deals" },
        quantity: { type: Number, required: true },
      },
    ],
    isVerifyStore:{type:String,default:false},
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    notifications: [
      {
        notificationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "notification",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const emplyee = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!userSchema;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.name) {
    user.name =
      user.name.trim()[0].toUpperCase() + user.name.slice(1).toLowerCase();
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  }

  next();
});
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
