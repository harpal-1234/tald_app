//token service
import * as tokenService from "./tokenservice.js";

//admin Vendor service

//admin Services
import * as  adminService from "./admin/auth.service.js";
//user services
import * as userService from "./user/auth.service.js";

import * as appServices from "./app.services.js/user.js";

// module.exports.userService=require("./user/profile/auth.service");
export { tokenService, adminService, userService, appServices };
