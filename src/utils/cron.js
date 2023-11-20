import cron from "node-cron";
import * as cronService from "../services/app.services.js/vendor.js";
// Your function to be executed every hour
cron.schedule("0 * * * *", async () => {
  try {
    console.log("cron start every 1 hour");
    await cronService.checkConsultationStatus();
    /////
  } catch (error) {
    console.log(error);
  }
});
// const cronExpression = "0 * * * *";
// cron.schedule(cronExpression, myFunction);
