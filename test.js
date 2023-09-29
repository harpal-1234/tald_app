import moment from "moment";

const date = new Date();
console.log(moment(date).toISOString());
var date1 = moment("2023-10-01T18:30:00.000Z");
console.log(date1.format("YYYY/MMMM/dd,HH:mm"));
