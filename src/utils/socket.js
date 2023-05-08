const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const {
  ROLE,
  ERROR_MESSAGES,
  STATUS_CODES,
  USER_TYPE,
} = require("../config/appConstants");
const { socketServices } = require("../services");
const { OperationalError } = require("../utils/errors");
const { Token } = require("../model");
const {
  CompositionSettingsList,
} = require("twilio/lib/rest/video/v1/compositionSettings");

let userCache = {};

/*
 
   userCache ={
       userId:socketId,
       user2Id:socketId2
   }
 
*/

exports.connectSocket = (server) => {
  io = socket(server);

  io.use(function (socket, next) {
    console.log("user is trying to connect");
    if (socket.handshake.query && socket.handshake.query.token) {
      console.log("user entered");
      jwt.verify(
        socket.handshake.query.token,
        config.jwt.secret,
        async function (err, decoded) {
          if (err || decoded.role == USER_TYPE.ADMIN)
            throw new OperationalError(
              STATUS_CODES.ACTION_FAILED,
              ERROR_MESSAGES.DOES_NOT_EXIST
            );
          const token = await Token.findOne({
            token: socket.handshake.query.token,
          }).lean();

          console.log(
            "decoded",
            decoded,
            token,
            "qwwwwwwwweerttttttttttyyyyyy"
          );

          socket.decoded = decoded;
          socket.decoded.user = token.user;
          let value = socket.decoded.user;
          if (!userCache[value]) {
            userCache[value] = [socket.id];
          } else {
            userCache[value].push(socket.id);
          }
          console.log("socketHolder", userCache);
          return next();
        }
      );
    } else {
      throw new OperationalError(
        ERROR_MESSAGES.DOES_NOT_EXIST,
        STATUS_CODES.ACTION_FAILED
      );
    }
  }).on("connection", (socket) => {
    socket.on("sendMessage", async (data) => {
      console.log(
        data.sender,
        data.message,
        data.type,
        data.groupName,
        data.eventId,
        data.groupId,
      );
      if (!data.message && !data.type) {
        throw new OperationalError(
          console.log("data does not exist"),
          STATUS_CODES.ACTION_FAILED
        );
      }
      if (data.groupId) {
        const message = await socketServices.saveGroupMessage(
          data.sender,
          users,
          data.message,
          data.type,
          data.groupId
        );

        const emits = [];
        users.map((id) => {
          if (JSON.stringify(data.sender) !== JSON.stringify(id)) {
            emits.push(id);
          }
        });

        emits.map((receiverId) => {
          if (userCache[receiverId]) {
            userCache[receiverId].map((id) => {
              io.to(id).emit("receiveMessage", message);
            });
          } else {
            console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
          }
        });
      }
      if (data.conversationId) {
        const conversation = await socketServices.getConversation(
          data.conversationId
        );
        if (!conversation) {
          throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.DOES_NOT_EXIST
          );
        }

        const senderId = socket.decoded.user;
        let receiverId;
        if (
          JSON.stringify(data.receiver) === JSON.stringify(socket.decoded.user)
        ) {
          receiverId = data.sender;
        } else {
          receiverId = data.receiver;
        }
        const message = await socketServices.saveMessages(
          senderId,
          receiverId,
          conversation._id,
          data.message,
          data.type
        );
        console.log(userCache[receiverId]);
        if (userCache[receiverId]) {
          userCache[receiverId].map((id) => {
            io.to(id).emit("receiveMessage", message);
          });
        }
      }
    });
    socket.on("error", function (error) {
      console.error(error, "something went wrong in socket...");
    });
    socket.on("disconnect", async (data) => {
      console.log("disconnect....", socket.id, userCache[socket.decoded.user]);

      userCache[socket.decoded.user] = userCache[socket.decoded.user].filter(
        (socketId) => socketId !== socket.id
      );
      console.log("disconneted", userCache);
    });
  });
};
