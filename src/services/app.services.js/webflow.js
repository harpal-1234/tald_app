import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";

export const sites = async (userId, projectName) => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append(
    "authorization",
    "Bearer 0ecb8f254f2a627040d321e81e9cb1c3efac7d837b87ef9919e0cdeadc341039"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://api.webflow.com/beta/sites",
      requestOptions
    );
    const result = await response.text();

    return JSON.parse(result);
  } catch (error) {
    console.log("error", error);
  }
};
