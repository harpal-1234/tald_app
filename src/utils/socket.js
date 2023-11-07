import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {
  ERROR_MESSAGES,
  STATUS_CODES,
  USER_TYPE,
} from "../config/appConstants.js";
import * as socketServices from "../services/user/socketChat.js";
import { OperationalError } from "../utils/errors.js";
import { Conversation, Token } from "../models/index.js";
import cors from "cors";

// const server = new Server();

let userCache = {};

// userCache = {
//   conversationId: [
//     {
//       userId: [socketId],
//       userId2: [socketId2],
//     },
//   ],
// };

// const socket = Socket

export const connectSocket = (server) => {
  const io = new Server(server, {
    allowEIO3: true,
    cors: {
      origin: ["http://localhost:3000", "https://api.tald.co","http://localhost:3001","https://designer.tald.co"],
    },
  });
  //io.use(cors());
  // io = socket(server, {
  //   allowEIO3: true,
  //   cors: {
  //     origin: "*",
  //   },
  // });
  io.use(function (socket, next) {
    console.log("user is trying to connect");
    if (socket.handshake.query && socket.handshake.query.token) {
      console.log("user entered");
      jwt.verify(
        socket.handshake.query.token,
        config.jwt.secret,
        async function (err, decoded) {
          console.log(err, decoded.role);
          if (err || decoded.role == USER_TYPE.ADMIN)
            throw new OperationalError(
              STATUS_CODES.ACTION_FAILED,
              ERROR_MESSAGES.DOES_NOT_EXIST
            );
          const token = await Token.findOne({
            token: socket.handshake.query.token,
          }).lean();

          const conversation = await Conversation.findOne({
            _id: socket.handshake.query.conversationId,
          }).lean();

          console.log(
            "decoded",
            decoded,
            token,
            "qwwwwwwwweerttttttttttyyyyyy"
          );

          socket.decoded = decoded;
          socket.decoded.user = token.user;
          socket.decoded.conversation = conversation?._id;
          console.log(socket.decoded.user,"llllllhihiohohhhhooioggogo")
          let value = socket.decoded.conversation;
          let userId =socket.decoded.user
          if (!userCache[value]) {
            userCache[value] = { [userId]: [socket.id] };
          } else {
            console.log(userCache[value])
            const keys = Object.keys(userCache[value]);
            const object = userCache[value];

            const obj = userCache[value]?.find((item) =>
              item.hasOwnProperty(userId)
            );
            console.log(obj,"ooooooobbbbbbjjjjjjjjkj")
            if (obj) {
              console.log(obj,"ooooooobbbbbbjjjjjjjjkj")
              obj[userId].push(socket.id);
            } else {
              console.log("replaceeeeeeeeeeeeeeee")
              userCache[value] = {
                ...object[keys[0]],
                [userId]: [socket.id],
              };
            }
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
      console.log(data.message, data.type, data.conversationId);
      if (!data.message && !data.type) {
        throw new OperationalError(
          console.log("data does not exist"),
          STATUS_CODES.ACTION_FAILED
        );
      }
      if (data.conversationId) {
        console.log("jgiuhiuhiuhihihgih    conversation")
        const conversation = await socketServices.oneConversation(
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
        if (JSON.stringify(senderId) == JSON.stringify(conversation.sender)) {
          receiverId = conversation.receiver;
        } else {
          receiverId = conversation.sender;
        }
        console.log(
          "jhuuiuuuuuuuuuuuuuuuuuuuuuuuuuuu",
          receiverId,
          senderId,
          "jkggggggggggggggggggfdegjgegfgrfg"
        );
        const message = await socketServices.saveMessages(
          senderId,
          receiverId,
          conversation._id,
          data.message,
          data.type
        );
        console.log(
          "jhuuiuuuuuuuuuuuuuuuuuuuuuuuuuuu",
          receiverId,
          senderId,
          "jkggggggggggggggggggfdegjgegfgrfg"
        );
        console.log(userCache[receiverId], senderId);
        console.log(message);
        if (message.isEmit) {
          console.log(userCache[conversation._id],"cccccccccccccccccc")
          userCache[conversation._id]?.forEach((users) => {
            if (users[receiverId]) {
              users[receiverId].forEach((socketId) => {
                console.log(socketId,"socketId")
                io.to(socketId).emit("receiveMessage", message);
              });
            }
          });
        }
      }
    });
    // socket.on("deleteMessage", async (data) => {
    //   console.log(data.messageId, data.receiver);
    //   const user = socket.decoded.user;
    //   if (data.groupId) {
    //     const data1 = await EventServices.deleteMessage(
    //       data.messageId,
    //       data.groupId
    //     );
    //     const emits = [];
    //     data1.receiver.map((id) => {
    //       if (JSON.stringify(user) !== JSON.stringify(id)) {
    //         emits.push(id);
    //       }
    //     });
    //     if (emits.length > 0) {
    //       emits.map((receiverId) => {
    //         if (userCache[receiverId]) {
    //           userCache[receiverId].map((id) => {
    //             io.to(id).emit("receiveDeleteMessage", data1);
    //           });
    //         } else {
    //           console.log(
    //             "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii123iiiiiiiiiiiiiiiii"
    //           );
    //         }
    //       });
    //     }
    //   } else {
    //     const data1 = await socketServices.deleteMessage(data.messageId);
    //     if (userCache[data.receiver]) {
    //       userCache[data.receiver].map((id) => {
    //         io.to(id).emit("receiveDeleteMessage", data1);
    //       });
    //     }
    //   }
    // });

    socket.on("error", function (error) {
      console.error(error, "something went wrong in socket...");
    });
    socket.on("disconnect", async (data) => {
      console.log("disconnect....", socket.id, userCache[socket.handshake.query.conversationId]);
      console.log(socket.handshake.query.conversationId)
      // const online = await socketServices.offlineStatus(socket.decoded.user);

      // online.users.map((receiverId) => {
      //   if (userCache[receiverId]) {
      //     userCache[receiverId].map((id) => {
      //       io.to(id).emit("onlineStatus", {
      //         userId: socket.decoded.user,
      //         isOnline: online.isOnline,
      //         offlineTime: online.offlineTime,
      //       });
      //     });
      //   } else {
      //     console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      //   }
      // });
      userCache[socket.handshake.query.conversationId].forEach((users) => {
        if (users[socket.decoded.user]) {
          users[socket.decoded.user].filter((socketId) =>socketId !== socket.id);
        }
      });
      console.log("disconneted", userCache);
    });
  });
};
