import mongoose from "mongoose";
import cors from"cors";
import app from "./app.js";
import config from "./src/config/config.js";
import logger from "./src/config/logger.js";
import CreateAdmin from "./src/utils/bootstrap.js";
import { connectSocket } from "./src/utils/socket.js";


// Enable CORS for socket.io

mongoose.set("strictQuery", false);
let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log("Connected to MongoDB");
  CreateAdmin();
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
  connectSocket(server);
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
