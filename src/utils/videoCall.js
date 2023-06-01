const jwt = require("jsonwebtoken");
const config = require("../config/config");
const dotenv = require("dotenv").config();
const crypto = require('crypto');
// const accountSid = config.TWILIO_ACCOUNT_SID;
// const authToken = config.Auth_Token;
// const username = config.USER_NAME;
// const client = require("twilio")(accountSid, authToken);
// const AccessToken = require("twilio").jwt.AccessToken


exports.videoCall = async (user, body, userToken) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let randomString = '';

  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters.charAt(randomIndex);
  }
    const TWILIO_ACCOUNT_SID = config.TWILIO_ACCOUNT_SID;
    const TWILIO_API_KEY_SID = config.TWILIO_API_KEY_SID;
    const TWILIO_API_KEY_SECRET = config.TWILIO_API_KEY_SECRET;
    const ACCESS_TOKEN_IDENTITY = Math.random().toString(36).substring(2, 15);
    const ROOM_NAME = randomString;
    const VideoGrant = AccessToken.VideoGrant;
    // enable client to use video, only for this room
    const videoGrant = new VideoGrant({
      room: ROOM_NAME,
    });
    const accessToken = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY_SID,
      TWILIO_API_KEY_SECRET
    );

    
    accessToken.addGrant(videoGrant); //Add the grant to the token
    accessToken.identity = ACCESS_TOKEN_IDENTITY;
    const token = accessToken.toJwt();
    console.log("iiiiiiiiiiiiiiiiii",token,"iiiiiiiiiiiiiii");
    // await sendNotif.notification(userToken.device.token);
    return { token, videoGrant };
  };