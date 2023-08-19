import express from "express";
import userAuth from "./user/auth.routes.js";
import staticRoutes from "../routes/static.routes.js";
import adminAuth from "./admin/auth.routes.js";
import vendor from "./vendor/auth.routes.js";
import client from "./client/client.routes.js"


const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
    route: adminAuth,
  },
  {
    path: "/vendor",
    route: vendor,
  },
  {
    path: "/user/auth",
    route: userAuth,
  },

  {
    path: "/",
    route: staticRoutes,
  },
  {
    path: "/client",
    route: client,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
