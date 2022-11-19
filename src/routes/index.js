const express = require("express");
const userAuth = require("./user/auth.routes");
const userProfile = require("./user/profile.routes");
const staticRoutes=require("../routes/static.routes");
const vendorAuth=require("./vendorAdmin/auth.routes");
const adminAuth=require("./admin/auth.routes")


//const staticRoutes = require("./");
//const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path:'/admin/auth',
    route:adminAuth

  },
  {
    path:'/vendor/auth',
    route:vendorAuth
  },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path:"/user/profile",
    route:userProfile
  },
 
//   {
//     path: "/admin",
//     route: adminAuth,
//   },

    {
      path: "/",
      route: staticRoutes,
    },

    // {
    //   path: "/user",
    //   route: commonRoutes,
    // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;