const bcrypt = require("bcryptjs");
// const { tokenService } = require("../../services");
const { successResponse } = require("../../utils/response");
const { User, Token, Admin } = require("../../models");
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

const createUser = async (userData) => {

    const data=await User.findOne({email:userData.email,isDeleted:false});
    if(data)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.EMAIL_ALREADY_EXIST
          );
    }
    const user = await User.create(userData);
    return user;
  }
;

const userLogin = async (email,name,password,socialId) => {

 if(socialId)
 {
 if(Object.keys(socialId).toString()=== 'facebookId')
 {

  const facebookUser = await User.findOneAndUpdate({ $or:[{socialId: socialId.facebookId},{email:email}] },{
    $set:{socialId:{facebookId:socialId.facebookId}},
    $setOnInsert:{
      email:email,
      name:name
       
    }
  },{upsert:true,new:true});
  

  return facebookUser;
 }
  
 if(Object.keys(socialId).toString() === 'googleId')
 {
  
  const googleUser = await User.findOneAndUpdate({ $or:[{socialId: socialId.googleId},{email:email}] },{
    $set:{socialId:{googleId:socialId.googleId}},
    $setOnInsert:{
      email:email,
      name:name
       
    }
  },{upsert:true,new:true});


  return googleUser;

 }
 if(Object.keys(socialId).toString() === 'appleId')
 {

  const appleUser = await User.findOneAndUpdate( {$or:[{socialId: socialId.appleId},{email:email}] },
    {$set:{socialId:{appleId:socialId.appleId}},
    $setOnInsert:{
      email:email,
      name:name
    }}
  ,{upsert:true,new:true});
  

  return appleUser;

 }
}
  let user = await User.findOne({ email:email});

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
    // throw new ApiError(
    //   ERROR_MESSAGES.EMAIL_NOT_FIND
    //   // httpStatus.UNAUTHORIZED,
    //   // "Email does not exist please signup"
    // );
  }

  if (user.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }

  if (user.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_DELETED
    );
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }

  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return user;
};

const userLogout=async(userId)=>{
  const token=await Token.findOne({_id:userId,isDeleted:false});
 
  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if(token.isDeleted){
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.LOG_OUT
    )
  }
  await Token.findByIdAndUpdate({_id:userId},{isDeleted:true},{new:true});
  return 

}

const resetPassword = async (tokenData, newPassword) => {
  let query = tokenData.user;
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.USER) {
    const userdata = await User.findOneAndUpdate(
      { _id: query },
      { $set: { password: newPassword } }
    );
    const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
      isDeleted: true,
    });
    return { userdata, tokenvalue };
  }

  const adminvalue = await Admin.findOneAndUpdate(
    { _id: query },
    { $set: { password: newPassword } }
  );
  const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
    isDeleted: true,
  });

  return { tokenvalue, adminvalue };
};


module.exports={
    createUser,
    userLogin,
    userLogout,
    resetPassword
}