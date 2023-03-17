//const {}= require("../../apiV1/model");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} = require("../../src/config/appConstants");
const { OperationalError } = require("../../src/utils/errors");
//const { addressFormatter } = require("../../utils/commonfunction");
//const { findOneAndUpdate, updateMany } = require("../../model/event");
const FCM = require("fcm-node");
const serverKey = process.env.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);
///const { v4: uuidv4 } = require("uuid");
//   const {
//     ModelBuildInstance,
//   } = require("twilio/lib/rest/autopilot/v1/assistant/modelBuild");
//   var fs = require("file-system");
//   const p8file = fs.readFileSync(
//     __dirname + "/P8FILE_HART_MUKESHRANA_SIGNINAPPLE_4YVD6HVV63 (2).p8",
//     "utf8"
//   );
//   var apn = require("apn");

const orderNotification = async (
  vendorId,
  messages,
  userId,
  dealId,
  quantity
) => {
  const dataToken = await Token.find({
    user: vendorId,
    isDeleted: false,
  })
    .distinct("device.token")
    .lean();
  //console.log(dataToken);
  // return dataToken.map((value) => {
  //   //  console.log(value);
  //   // tokenArray.push(value);
  //   return value;
  // });

  // const arr1 = deviceTokens.flat();
  // console.log(arr1);

  var message = {
    registration_ids: dataToken,

    //collapse_key: 'your_collapse_key',
    priority: "high",
    content_available: true,

    notification: {
      title: messages,
      body: quantity,
    },

    data: {
      //you can send only notification or only data(or include both)
      userId: userId,
      dealId: dealId,
      quantity:quantity
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("something went wrong");
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.FCM_ERROR
      );
    } else {
      return response;
    }
  });
};
module.exports = {
  orderNotification,
};
