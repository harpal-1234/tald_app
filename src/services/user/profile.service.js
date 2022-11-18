const { successResponse } = require("../../utils/response");
const { User } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  loginType,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  POPULATE_SKILLS,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const bcrypt=require("bcryptjs")

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
  const user= await User.findOne({$or:[{email:email},{name:name}],isDeleted:false});
  if(!user)
  {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  return 
}

module.exports={
  editProfile,
  changePassword,
  contactUs
}