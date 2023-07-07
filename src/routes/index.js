import express from "express";
import userAuth from "./user/auth.routes.js";
import staticRoutes from "../routes/static.routes.js";
import adminAuth from "./admin/auth.routes.js";

//const adminUserRoutes=require("./admin/user.routes");
//const staticRoutes = require("./");
//const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
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
    path: "/",
    route: staticRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
