//token service
module.exports.SocketServices = require("./app.services.js/chat")
module.exports.tokenService = require("./tokenservice");

//admin Vendor service

//admin Services
module.exports.adminService = require("./admin/auth.service");
//user services
module.exports.userService = require("./user/auth.service");

module.exports.userProfileService = require("./user/profile.service");
module.exports.appServices=require("./app.services.js/user")

// module.exports.userService=require("./user/profile/auth.service");
