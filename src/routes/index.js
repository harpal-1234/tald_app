const express = require("express");
const userAuth = require("./user/auth.routes");
const userProfile = require("./user/profile.routes");
const staticRoutes = require("../routes/static.routes");
const adminAuth = require("./admin/auth.routes");
const app = require("./app/user.routes")
//const adminUserRoutes=require("./admin/user.routes");
//const staticRoutes = require("./");
//const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin/auth",
    route: adminAuth,
  },
  // {
  //   path: "/admin/user",
  //   route: adminUserRoutes,
  // },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path: "/user/profile",
    route: userProfile,
  },
  {
    path: "/app/user",
    route: app,
  },
  {
    path: "/",
    route: staticRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
