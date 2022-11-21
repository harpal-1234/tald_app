//token service



module.exports.tokenService=require("./tokenservice")

//admin Vendor service
module.exports.vendorAdminService=require('./vendor/auth.service');
module.exports.vendorCouponService=require('./vendor/coupon.service')

//admin 
module.exports.adminService=require("./admin/auth.service");

//user services
module.exports.userService=require("./user/auth.service");
module.exports.userProfileService=require("./user/profile.service");
// module.exports.userService=require("./user/profile/auth.service");