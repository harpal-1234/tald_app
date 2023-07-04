import {User, Token } from "../../src/models/index.js";
import {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../src/config/appConstants.js";
import { OperationalError } from "../../src/utils/errors.js";
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
const calls = async (token, roomName, userId, senderId, type) => {
  const sende = await User.findOne({ _id: senderId });

  const user = await User.findOne({ _id: userId, isDeleted: false });


  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  const iosToken = [];
  const androidToken = [];
  var dataToken = await Token.find({
    user: userId,
    isDeleted: false,
  })
    .distinct("device")
    .lean();
  dataToken.map((value) => {
    if (value.type === "IOS") {
      iosToken.push(value.apns);
    } else {
      androidToken.push(value.token);
    }
  });
  console.log(
    iosToken,
    androidToken,
    "toooooooooooooookeeeeeeeeeeeeeennnnnnnnnnnnnn"
  );
  if (androidToken.length > 0) {
    var message = {
      registration_ids: androidToken,

      //collapse_key: 'your_collapse_key',
      priority: "high",
      content_available: true,

      // notification: {
      //   title: title,
      //   body: body,
      //   imageUrl: image,
      // },

      data: {
        //you can send only notification or only data(or include both)
        token: token,
        roomName: roomName,
        type: type,
        messageFrom: sende.name,
        otherToken: "ekrjgnjkeng",
        handle: "magentas",
        callerName: sende.name,
        callerId: sende._id,
        userId: senderId,
        image: sende.image,
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
  }
  if (iosToken.length > 0) {
    console.log(uuidv4());
    var options = {
      token: {
        key: p8file,
        keyId: process.env.KEY_ID,
        teamId: process.env.TEAM_ID,
      },
      production: false,
    };
    // const user = await User.findOne({ _id: userId }).lean();
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.body = "Video Call";
    note.expiry = Math.floor(Date.now() / 1000) + 60; // Expires 1 minute from now.
    note.badge = 3;
    // note.sound = "ping.aiff";
    note.alert = "You have a new video call";
    note.payload = {
      aps: {
        "content-available": 1,
        voip: "background",
        "apns-priority": 5,
      },
      messageFrom: sende.name,
      token: "wjbge",
      roomName: roomName,
      otherToken: "ekrjgnjkeng",
      handle: "magentas",
      callerName: sende.name,
      callerId: sende._id,
      uuid: uuidv4(),
      userId: senderId,
      type: type,
      image: sende.image,
    };
    note.topic = process.env.BUNDLE_ID;
    apnProvider
      .send(note, iosToken)
      .then((response) => {
        console.log(JSON.stringify(response), "apnssssss logggg 33333??");
        // return ;
      })
      .catch((err) => {
        console.log(err, "errrrrorrrrrrr");
      });

    /* GC(Garbage collector) doesn't automatically shutdown the apn.Provider(),
     so we need to call apnProvder.shutdown()....
    */
    apnProvider.shutdown();
    console.log("-----------apn shutdown called----------");
  }
};
const rejectCall = async (senderId, userId, status) => {
  console.log(senderId, userId, status);

  const val = await User.findOne({ _id: userId });

  var dataToken = await Token.find({
    user: userId,
    isDeleted: false,
  })
    .distinct("device.token")
    .lean();

  // return dataToken.map((value) => {
  //   //  console.log(value);
  //   // tokenArray.push(value);
  //   return value;
  // });
  console.log(dataToken, "ddddatttaatoken");

  // const arr1 = deviceToken.flat();
  // console.log(arr1);

  var message = {
    registration_ids: dataToken,

    //collapse_key: 'your_collapse_key',
    priority: "high",
    content_available: true,

    notification: {
      title: status,
      body: "qqqqqq",
    },

    data: {
      status: status,
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
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
export default{ calls, rejectCall };
