import axios from "axios";
const createToken = async () => {
  const createMeetingResponse = await axios.get(
    "https://zoom.us/oauth/authorize?response_type=code&client_id=GuiPmdbXTwGFQRXnCvatKA&redirect_uri=https://api.tald.co/vendor/app/callBack"
  );
};
createToken();
