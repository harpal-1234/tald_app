import mongoose from "mongoose";
import app from "./app.js";
import config from "./src/config/config.js";
import logger from "./src/config/logger.js";
import CreateAdmin from "./src/utils/bootstrap.js";
mongoose.set('strictQuery', false);
let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log("Connected to MongoDB");
  CreateAdmin();
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
