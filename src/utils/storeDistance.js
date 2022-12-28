const { Store, User, Token } = require("../models");
const { OperationalError } = require("./errors");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
  ERROR_MESSAGES,
} = require("../config/appConstants");
const distance = require("google-distance-matrix");
const config = require("../config/config");
const FCM = require("fcm-node");
// const serverKey = config.fcmServerKey;
// const fcm = new FCM(serverKey);

// const storeDistance = async (
//   storeId,
//   long,
//   lat,
//   userId,
//   type,
//   title,
//   image,
//   body,
//   matchId
// ) => {
  

//   const user = await User.findOne({ _id: userId,isPushNotification:true, isDeleted: false });

//   if (!user) {
//     throw new OperationalError(
//       STATUS_CODES.ACTION_FAILED,
//       ERROR_MESSAGES.DOES_NOT_EXIST
//     );
  
//   }
//   const token= await Token.find({user: user.id,isDeleted: false}).distinct("device.token").lean();

//   var message = {
//     registration_ids: token,

//     //collapse_key: 'your_collapse_key',
//     priority: "high",
//     content_available: true,

//     notification: {
//       title: title,
//       body: body,
//       imageUrl: image,
//     },

//     data: {
//       //you can send only notification or only data(or include both)
//       type: type,
//       match: matchId,
//     },
//   };

//   fcm.send(message, function (err, response) {
//     if (err) {
//       console.log("something went wrong");
//       throw new OperationalError(
//         STATUS_CODES.ACTION_FAILED,
//         ERROR_MESSAGES.DOES_NOT_EXIST
//       );
//     } else {
//       return response;
//     }
//   });
// };

// module.exports = {
//   storeDistance,
// };

// const store=await Store.findOne({_id:storeId,isDeleted:false});
// if(!store)
// {
//     throw new OperationalError(
//         STATUS_CODES.ACTION_FAILED,
//         ERROR_MESSAGES.STORE_NOT_EXIST
//       );

// }
// const storedata=store.location.loc.coordinates

// var origins = [long,lat];
// var destinations = storedata;
// var data;

// const data1=distance.matrix(origins, destinations, function (err, distances) {
//   if (!err)
//       data=distances;

// }

// );

// console.log(data,"data1");

// return data
