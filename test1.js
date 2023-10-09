
import  axios from "axios";
const  createToken = async () =>{
  const code = "req.query.code";

  const tokenUrl = "https://zoom.us/oauth/token";

  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: "https://oauth.pstmn.io/v1/callback",
  };
const clientId ="GuiPmdbXTwGFQRXnCvatKA";
const clientSeceret ="s3UXkPfleU3jft1F2bC3UCLedtFqvaEn";
const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSeceret}`).toString('base64')}`;

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
      "https://api.zoom.us/v2/users/me/meetings",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,           
          "Content-Type": "application/json",
        },
      }
    );

    const joinUrl = createMeetingResponse.data.join_url;
    console.log(`Zoom meeting link: ${joinUrl}`);

    res.send(
      `Zoom meeting link: <a href="${joinUrl}" target="_blank">${joinUrl}</a>`
    );
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    //    res.send("Error creating Zoom meeting");
  }
}
createToken();
