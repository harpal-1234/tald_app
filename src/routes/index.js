const express = require("express");
const userAuth = require("./user/auth.routes");
const userProfile = require("./user/profile.routes");
const staticRoutes = require("../routes/static.routes");
const vendorAuth = require("./vendor/auth.routes");
const couponRoutes = require("./vendor/deal.routes");
const adminAuth = require("./admin/auth.routes");
const bannerRoutes = require("./vendor/banner.routes");
const dealsRoutes = require("./user/deals.routes");
const storeRoutes = require("./vendor/store.routes");
const adminBannerRoutes = require("./admin/banner.routes");
const adminVendorRoutes = require("./admin/vendor.routes");
const adminNotification = require("./admin/notification.routes");
const adminUserRoutes=require("./admin/user.routes");
const adminDealRoutes=require("./admin/deal.routes");
const adminStoreRoutes=require("./admin/store.routes");
//const staticRoutes = require("./");
//const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin/auth",
    route: adminAuth,
  },
  {
    path: "/admin/notification",
    route: adminNotification,
  },
  {
    path: "/admin/user",
    route: adminUserRoutes,
  },
  {
    
    path: "/admin/store",
    route: adminStoreRoutes,

  },
  {
    path: "/admin/vendor",
    route: adminVendorRoutes,
  },
  {
    path: "/admin/deal",
    route: adminDealRoutes,
  },
  {
    path: "/admin/banner",
    route: adminBannerRoutes,
  },
  {
    path: "/store/banner",
    route: bannerRoutes,
  },
  {
    path: "/store/auth",
    route: vendorAuth,
  },
  {
    path: "/store/deal",
    route: couponRoutes,
  },
  {
    path: "/vendor/store",
    route: storeRoutes,
  },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path: "/user/deal",
    route: dealsRoutes,
  },
  {
    path: "/user/profile",
    route: userProfile,
  },

  //   {
  //     path: "/admin",
  //     route: adminAuth,
  //   },

  {
    path: "/user",
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
