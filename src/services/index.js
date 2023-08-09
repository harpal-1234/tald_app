//token service
import * as tokenService from "./tokenservice.js";

//admin Vendor service

//admin Services
import * as adminService from "./admin/auth.service.js";
//user services
import * as userService from "./user/auth.service.js";
import * as vendorServices from "./app.services.js/vendor.js";

// module.exports.userService=require("./user/profile/auth.service");
export { tokenService, adminService, userService, vendorServices };
