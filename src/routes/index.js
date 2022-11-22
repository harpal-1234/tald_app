const express = require("express");
const userAuth = require("./user/auth.routes");
const userProfile = require("./user/profile.routes");
const staticRoutes=require("../routes/static.routes");
const vendorAuth=require("./vendor/auth.routes");
const coupon=require("./vendor/coupon.routes");
const adminAuth=require("./admin/auth.routes")
const bannerRoutes=require('./admin/banner.routes')

//const staticRoutes = require("./");
//const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
 
  {
    path:'/admin/auth',
    route:adminAuth

  },
  {
    path:'/admin/banner',
    route:bannerRoutes
  },
  {
    path:'/vendor/auth',
    route:vendorAuth
  },
  {
    path:'/vendor/coupon',
    route:coupon
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