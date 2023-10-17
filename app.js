import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import passport from "passport";
import compression from "compression";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorHandler } from "./src/middlewares/common.js";
import { jwtStrategy } from "./src/config/passport.js";
import routes from "./src/routes/index.js";
import i18n from "./src/middlewares/i18n.js";
import {
  requestHandler,
  routeNotFoundHandler,
} from "./src/middlewares/common.js";

const app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));

app.use(i18n.init);

app.use((req, res, next) => {
  requestHandler(req, res, next);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// set security HTTP headers
//app.use(helmet());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());

//require('./Server/apiV1/config/passport')(passport);
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
// app.use("/user/auth", authLimiter);
app.use(morgan("dev"));

// v1 api routes
app.use("/", routes);
// app.use("/", routes)
// router.put("/admin",(req,res)=>{
//   console.log(req.token)
// })

//send back a 404 error for any unknown api request
app.use((req, res, next) => {
  routeNotFoundHandler(req, res, next);
});

// handle error

app.use(errorHandler);

export default app;
