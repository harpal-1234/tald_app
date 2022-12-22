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
const { formatUser, formatFavourites, formatPurchase, formatStoreDeal } = require("../../utils/commonFunction");

const editProfile = catchAsync(async (req, res) => {
  const user = await userProfileService.editProfile(
    req.token.user._id,
    req.body
  );
  const data=formatUser(user);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
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
  const userDetails=await userProfileService.contactUs(req.body);
  const user = await contactUs(userDetails.name,req.body.message,userDetails.email);
 
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CONTACT_US
  );
});

const pushNotificationStatus =catchAsync(async(req,res)=>{
  const newUser=await userProfileService.pushNotificationStatus(req.token.user._id);
  const data = {
    name: newUser.name,
    email: newUser.email,
    pushNotification:newUser.isPushNotification,
    phoneNumber:newUser.phoneNumber
  };
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.PUSH_NOTIFICATION_STATUS,
    data
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



const myFavourites= catchAsync(async (req, res) => {
  const user=await userProfileService.myFavourites(req,res);
  const value=formatFavourites(user.favourite);
  const dataCount=user.count;
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FAVOURITES_DEALS,
    value,
    dataCount
  );
});


const dealPurchaseData= catchAsync(async (req, res) => {
  const user=await userProfileService.dealPurchaseData(req.token.user._id);
  const value=formatPurchase(user);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FAVOURITES_DEALS,
    value
  );
});

const favouriteStoreDeal= catchAsync(async (req, res) => {
  const user=await userProfileService.favouriteStoreDeal(req, res);
  const value=formatStoreDeal(user)
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.STORE_DEALS,
   value
  );
})


module.exports = {
  editProfile,
  changePassword,
  userContactUs,
  userLocation,
  pushNotificationStatus,
  myFavourites,
  dealPurchaseData,
  favouriteStoreDeal
};