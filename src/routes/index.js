const express = require("express");
const userAuth = require("./user/auth.routes");
const userProfile = require("./user/profile.routes");
const staticRoutes=require("../routes/static.routes");
const vendorAuth=require("./vendor/auth.routes");
const couponRoutes=require("./vendor/coupon.routes");
const adminAuth=require("./admin/auth.routes");
const bannerRoutes=require('./vendor/banner.routes');
const dealsRoutes=require("./user/deals.routes");
const storeRoutes=require("./vendor/store.routes");
const adminBannerRoutes=require("./admin/banner.routes");
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
    route:adminBannerRoutes

  },
  {
    path:'/vendor/banner',
    route:bannerRoutes
  },
  {
    path:'/vendor/auth',
    route:vendorAuth
  },
  {
    path:'/vendor/coupon',
    route:couponRoutes
  },
  {
    path:'/vendor/store',
    route:storeRoutes
  },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path:"/user/deals",
    route:dealsRoutes
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