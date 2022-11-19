const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {WORK_TYPE, USER_TYPE, JOB_TITLE} = require("../config/appConstants");
// const { address } = require("./commonField.models");
const { string } = require("joi");

const userSchema = mongoose.Schema(
  {
    // email:{type:String,required:true},
    name:{ type: String, default: "" },
    password: { type: String, default: "" },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse:true,
      default:""
    },
    location:{
      street: { type: String, default: "" },
      loc: {
        type: { type: String, default: "Point" },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    phoneNumber:{ type: String, default: "" },
    socialId:{
      googleId:{ type: String,sparse:true},
      facebookId:{ type: String,sparse:true},
      appleId:{ type: String,sparse:true},
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified:{type: Boolean, default: false}

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
  if(user.name)
  {
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
  return bcrypt.compare(password,user.password);
 
};


const User = mongoose.model("user", userSchema);

module.exports = User;




module.exports = User;