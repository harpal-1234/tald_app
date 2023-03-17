const {}= require("../../apiV1/model");
  const {
    USER_TYPE,
    STATUS_CODES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
  } = require("../../apiV1/config/appConstants");
  const { OperationalError } = require("../../apiV1/utils/errors");
  //const { addressFormatter } = require("../../utils/commonfunction");
  //const { findOneAndUpdate, updateMany } = require("../../model/event");
  const FCM = require("fcm-node");
  const serverKey = process.env.SERVER_KEY;
  const fcm = new FCM(serverKey);
  const { v4: uuidv4 } = require("uuid");
//   const {
//     ModelBuildInstance,
//   } = require("twilio/lib/rest/autopilot/v1/assistant/modelBuild");
//   var fs = require("file-system");
//   const p8file = fs.readFileSync(
//     __dirname + "/P8FILE_HART_MUKESHRANA_SIGNINAPPLE_4YVD6HVV63 (2).p8",
//     "utf8"
//   ); 
//   var apn = require("apn");
  
 
  console.log(p8file);
  
  const orderNotification = async (
    userIds,
    messages,
    eventId,
    announcment
  ) => {
    const deviceTokens = await Promise.all(
      userIds.map(async (Id) => {
        var dataToken = await Token.find({
          user: Id,
          isDeleted: false,
        })
          .distinct("device.token")
          .lean();
        //console.log(dataToken);
        return dataToken.map((value) => {
          //  console.log(value);
          // tokenArray.push(value);
          return value;
        });
      })
    );
  
    const arr1 = deviceTokens.flat();
    console.log(arr1);
  
    var message = {
      registration_ids: arr1,
  
      //collapse_key: 'your_collapse_key',
      priority: "high",
      content_available: true,
  
      notification: {
        title: messages,
        body: announcment,
      },
  
      data: {
        //you can send only notification or only data(or include both)
        eventId: eventId,
        announcment: announcment,
      },
    };
  
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("something went wrong");
        throw new OperationalError(
          STATUS_CODES.ACTION_FAILED,
          ERROR_MESSAGES.DOES_NOT_EXIST
        );
      } else {
        return response;
      }
    });
  };
  module.exports={
    orderNotification
  }