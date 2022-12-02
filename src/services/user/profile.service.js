const { successResponse } = require("../../utils/response");
const { User } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const bcrypt=require("bcryptjs");


const editProfile=async(id,data)=>{
  const user=await User.findOne({_id:id,isDeleted:false});
  if(!user)
  {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
 
  const updateUser= await User.findByIdAndUpdate({_id:user.id},
  {$set:{
   name:data.name,
   email:data.email,
   phoneNumber:data.phoneNumber
  }}
  )
  return updateUser;

}

const changePassword = async (userId, oldPassword, newPassword) => {
  
  const user= await User.findById(userId);
  
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OLD_PASSWORD
    );
  }

   let updatedPassword = { password: newPassword };

   Object.assign(user, updatedPassword);
   const va = await user.save();

  return user;
};

const contactUs=async(name,email)=>{
  const user= await User.findOne({$and:[{email:email},{name:name}],isDeleted:false});
  console.log(user);
  if(!user)
  {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  return 
}

const userLocation=async(req,res)=>{
  const user=await User.findOne({_id:req.token.user._id});
  if(!user)
  {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );

  }
  const userLocation=await User.findByIdAndUpdate({_id:user.id},{
    location:{
      address:req.body.address,
      loc:{
      coordinates:[(req.body.long),(req.body.lat)]
      }
    }
  },{upsert:false});
 
  return 
}

module.exports={
  editProfile,
  changePassword,
  contactUs,
  userLocation
}