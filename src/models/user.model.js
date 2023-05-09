const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  WORK_TYPE,
  USER_TYPE,
  JOB_TITLE,
  PUSH_NOTIFICATION_STATUS,
  PRONOUN,
  GENDER,
  SIGN,
  PETS,
  DISTANCE,
  PREFERANCES,
  LIFE_STYLE,
  DRUGS,
  HOBBIES_AND_INTRESTS,
  LOOKIN_FOR,
  DEVICE_TYPE,
  POLITICALS_VIEWS,
  NOTIFICATION_STATUS,
  PLANS,
} = require("../config/appConstants");
// const { address } = require("./commonField.models");
const { string } = require("joi");

const userSchema = mongoose.Schema(
  {
    // email:{type:String,required:true},
    name: { type: String, default: "" },
    stripeId: { type: String, default: "" },
    images: [{ image: { type: String } }],
    address: { type: String, default: "" },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
        required: true,
      },
    },
    //logitude and latitude
    phoneNumber: { type: String },
    profession: { type: String },
    bio: { type: String },
    dateOfBirth: { type: String },
    age: { type: Number },
    pronoun: { type: String, enum: [...Object.values(PRONOUN)] },
    politicalViews: {
      type: String,
      enum: [...Object.values(POLITICALS_VIEWS)],
    },
    sign: { type: String, enum: [...Object.values(SIGN)] },
    genderIdentity: { type: String, enum: [...Object.values(GENDER)] },
    prefrences: [{ type: String, enum: [...Object.values(PREFERANCES)] }],
    lifeStyles: [{ type: String, enum: [...Object.values(LIFE_STYLE)] }],
    drugUsages: [{ type: String, enum: [...Object.values(DRUGS)] }],
    hobbiesAndInterests: [
      { type: String, enum: [...Object.values(HOBBIES_AND_INTRESTS)] },
    ],
    pets: [{ type: String, enum: [...Object.values(PETS)] }],
    lookingFor: [{ type: String, enum: [...Object.values(LOOKIN_FOR)] }],
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    sendRequests: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    matches: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    dislikes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    socialId: { type: String },
    isNotification: {
      type: String,
      enum: [...Object.values(NOTIFICATION_STATUS)],
      default: NOTIFICATION_STATUS.ENABLE,
    },
    seeDistance: {
      type: String,
      enum: [...Object.values(DISTANCE)],
      default: DISTANCE.KM,
    },
    distance: { type: Number, default: 100 },
    maxAge: { type: Number, default: 40 },
    minAge: { type: Number, default: 18 },
    isVerify: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    packages: {
      type: String,
      enum: [...Object.values(PLANS)],
      default: PLANS.FREEMIUM,
    },
    packages: { type: Date },
    gifts: { type: Number, default: 0 },
    giftDate: { type: Date },
    profileBoast: { type: Boolean, default: false },
    boastDate: { type: Date },
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

// userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const emplyee = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!userSchema;
// };

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.name) {
//     user.name =
//       user.name.trim()[0].toUpperCase() + user.name.slice(1).toLowerCase();
//     if (user.isModified("password")) {
//       user.password = await bcrypt.hash(user.password, 8);
//     }
//   }

//   next();
// });
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

userSchema.index({ location: "2dsphere" });
const User = mongoose.model("user", userSchema);

module.exports = User;
