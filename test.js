import express from "express";
import axios from "axios";
const app = express();

// Replace with your OAuth app's credentials
const callBack = async () => {
  // const code = "req.query.code";

  const tokenUrl = "https://zoom.us/oauth/token";

  const data = {
    grant_type: "account_credentials",
    account_id: "nGJEkhXYQpGltGP4oZ50XA",
    //redirect_uri: "https://api.tald.co/vendor/app/callBack",
  };
  const clientId = "23xbSBDSHakRlBrLR_TmA";
  const clientSeceret = "fjyUODs4w57VP3RLKmng5tZROuh3OagG";
  const authHeader = `Basic ${Buffer.from(
    `${clientId}:${clientSeceret}`
  ).toString("base64")}`;

  const config = {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams(data),
      config
    );
    console.log(response.data, "hhhhhhhhhhhhhhhhhhhhhhhhhh");

    const accessToken = response.data.access_token;
    const startTime = new Date();
    const durationInMinutes = 60; 
    const createMeetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Consultations Meeting",
        type: 1,
        start_time: startTime.toISOString(),
        duration: durationInMinutes,
        settings: {
          host_email: "harpaljodha1998@gmail.com",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const joinUrl = createMeetingResponse.data.join_url;
    console.log(
      `Zoom meeting link: <a href="${joinUrl}" target="_blank">${joinUrl}</a>`
    );

    return joinUrl;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};
callBack();
