const express = require('express');
const axios = require('axios');
const app = express();

// Replace with your OAuth app's credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const redirectUri = 'YOUR_REDIRECT_URI';

app.get('/auth/zoom', (req, res) => {
  const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

  // Redirect the user to the Zoom authorization page
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  const tokenUrl = 'https://zoom.us/oauth/token';

  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };

  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

  const config = {
    headers: {
      Authorization: authHeader,
    },
  };

  try {
    const response = await axios.post(tokenUrl, new URLSearchParams(data), config);

    const accessToken = response.data.access_token;

    // You now have the access token for making authenticated requests to Zoom APIs

    // Create a Zoom meeting using the access token
    const createMeetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const joinUrl = createMeetingResponse.data.join_url;
    console.log(`Zoom meeting link: ${joinUrl}`);

    res.send(`Zoom meeting link: <a href="${joinUrl}" target="_blank">${joinUrl}</a>`);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.send('Error creating Zoom meeting');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
import jwt from "jsonwebtoken";
import KJUR from "jsrsasign";
// https://www.npmjs.com/package/jsrsasign

function generateSignature(secret) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: "GuiPmdbXTwGFQRXnCvatKA",
    appKey: "GuiPmdbXTwGFQRXnCvatKA",
    mn: 1,
    role: "role",
    iat: iat,
    exp: exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);
  console.log(sdkJWT)
  return sdkJWT;
}


generateSignature("s3UXkPfleU3jft1F2bC3UCLedtFqvaEn");
