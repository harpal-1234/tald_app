const distance = async (lat, long, lat1, lon1, measuring) => {
  const lat2 = lat;
  const lon2 = long;

  // convert coordinates to radians
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const radlon1 = (Math.PI * lon1) / 180;
  const radlon2 = (Math.PI * lon2) / 180;

  // calculate the difference between the coordinates
  const dLat = radlat2 - radlat1;
  const dLon = radlon2 - radlon1;

  // apply the Haversine formula
  const calculate =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radlat1) *
      Math.cos(radlat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const formula =
    2 * Math.atan2(Math.sqrt(calculate), Math.sqrt(1 - calculate));
  if (measuring == "Km") {
    const distance = 6371 * formula; // result is in kilometers
    return distance.toFixed(1) + " " + "Km";
  } else {
    const distance = 3959 * formula; // result is in miles
    return distance.toFixed(1) + " " + "Miles";
  }
};
module.exports = {
  distance,
};
