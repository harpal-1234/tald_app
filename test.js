// const socket = require("socket.io");
// const jwt = require("jsonwebtoken");
// const config = require("../config/config");
// const { userType } = require("../config/appConstants");
// const { socketService } = require("../services");
// const { formatDriverLoc } = require("./formatResponse");
 
// let socketIds = [];
 
// /*
 
//    userCache ={
//        userId:socketId,
//        user2Id:socketId2
//    }
 
// */
 
// exports.connectSocket = (server) => {
//   io = socket(server);
 
//   io.use(function (socket, next) {
//     console.log("user tring to connect");
//     if (socket.handshake.query && socket.handshake.query.token) {
//       console.log("user enter");
//       jwt.verify(
//         socket.handshake.query.token,
//         config.jwt.secret,
//         function (err, decoded) {
//           if (err) return next(new Error("Authentication error"));
//           // console.log("decoded", decoded, "qqqqqqqqqqqqwwwwwwwwwweeeeerrrrrtyytyty");
//           socket.decoded = decoded;
//           let value = socket.decoded.user;
 
//           if (decoded.role == userType.ADMIN) {
//             socketIds.push(socket.id);
//           }
//           console.log("socketHolder", socketIds);
//           return next();
//         }
//       );
//     } else {
//       return next(new Error("Authentication error"));
//     }
//   }).on("connection", (socket) => {
//     socket.on("getLatLng", async (data) => {
//       console.log(data);
//       if (!data.lat || !data.lng) {
//         return console.log("Longitude and latitude is required");
//       }
//       let userId = socket.decoded.user;
//       await socketService.updateDiverLoc(userId, data.lat, data.lng);
//       const drivers = await socketService.getDrivers();
//       const formattedDriver = formatDriverLoc(drivers);
//       socketIds.map((id) => {
//         io.to(id).emit("receiveLatLng", formattedDriver);
//       });
 
//       var socketids = [];
//     });
//     socket.on("error", function (error) {
//       console.error(error, "something went wrong in socket");
//     });
//     socket.on("disconnect", async (data) => {
//       console.log("disconnect", socket.id);
//       socket.on
//       socketIds = socketIds.filter((socketId) => socketId !== socket.id);
//       console.log(socketIds);
//     });
//   });
// };


