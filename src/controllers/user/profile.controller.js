const { userService, userProfileService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const { contactUs } = require("../../utils/sendMail");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  DELETE_MASSAGES,
  USER_TYPE,
} = require("../../config/appConstants");
const {
  formatUser,
  formatFavourites,
  formatPurchase,
  formatStoreDeal,
} = require("../../utils/commonFunction");

const editProfile = catchAsync(async (req, res) => {
  const user = await userProfileService.editProfile(
    req.token.user._id,
    req.body
  );
  const data = formatUser(user);
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
    req.body.newPassword
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_PASSWORD
  );
});

const userContactUs = catchAsync(async (req, res) => {
  const userId = req.token.user._id;
  const userDetails = await userProfileService.contactUs(userId);

  const user = await contactUs(
    userDetails.name,
    req.body.message,
    userDetails.phoneNumber
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.CONTACT_US
  );
});

const deleteProfile = catchAsync(async(req,res)=>{
  const userId = req.token.user._id;
  const user = await userProfileService.deleteUser(userId);
  if(user){
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      DELETE_MASSAGES.USER_DELETED
    );
  }

})
const userLocation = catchAsync(async (req, res) => {
  const location = await userProfileService.userLocation(
    req.token.user._id,
    req.body
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_LOCATION
  );
});

module.exports = {
  editProfile,
  changePassword,
  userContactUs,
  userLocation,
  deleteProfile

};
