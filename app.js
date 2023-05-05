const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const passport = require("passport");
const compression = require("compression");

//const cron = require("node-cron");
const bodyParser = require("body-parser");
//const cronNode= require("./server/apiV1/utils/cron")
const { errorHandler } = require("./src/middlewares/common");
// const {
//     requestHandler,
//     routeNotFoundHandler,
//   } = require("./");

const { jwtStrategy } = require("./src/config/passport");
const routes = require("./src/routes");

const i18n = require("./src/middlewares/i18n");
const {
  requestHandler,
  routeNotFoundHandler,
} = require("./src/middlewares/common");

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

module.exports = app;
