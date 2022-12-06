const { userService,userProfileService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {contactUs}=require("../../utils/sendMail");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE
} = require("../../config/appConstants");
const { formatUser, formatFavourites } = require("../../utils/commonFunction");

const editProfile = catchAsync(async (req, res) => {
  const user = await userProfileService.editProfile(
    req.token.user._id,
    req.body
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userProfileService.changePassword(
    req.token.user._id,
    req.body.oldPassword,
    req.body.newPassword,
  );
 
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_PASSWORD
  );
});

const userContactUs= catchAsync(async (req, res) => {
  const userDetails=await userProfileService.contactUs(req.body.name,req.body.email);
  const user = await contactUs(req.body.name,req.body.message,req.body.email);
 
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CONTACT_US
  );
});

const pushNotificationStatus =catchAsync(async(req,res)=>{
  const notification=await userProfileService.pushNotificationStatus(req,res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT,
  );

})

const userLocation= catchAsync(async (req, res) => {
  const location=await userProfileService.userLocation(req,res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_LOCATION
  );
});

const favourites= catchAsync(async (req, res) => {
  const user=await userProfileService.favourites(req,res);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_LOCATION
  );
});

const myFavourites= catchAsync(async (req, res) => {
  const user=await userProfileService.myFavourites(req,res);
  const value=formatFavourites(user);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FAVOURITES_DEALS,
    user
  );
});



module.exports = {
  editProfile,
  changePassword,
  userContactUs,
  userLocation,
  pushNotificationStatus,
  favourites,
  myFavourites
};