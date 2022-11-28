//token service



module.exports.tokenService=require("./tokenservice")

//admin Vendor service
module.exports.vendorAdminService=require('./vendor/auth.service');
module.exports.vendorDealsService=require('./vendor/deals.service');
module.exports.vendorStoreService=require('./vendor/store.service');

//admin Services
module.exports.adminService=require("./admin/auth.service");
module.exports.bannerService=require("./vendor/banner.service");

//user services
module.exports.userService=require("./user/auth.service");
module.exports.dealsService=require("./user/deals.service");
module.exports.userProfileService=require("./user/profile.service");
// module.exports.userService=require("./user/profile/auth.service");

