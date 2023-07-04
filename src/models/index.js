// module.exports = {
//   Token: require("./token.model"),
//   User: require("./user.model"),
//   Admin: require("./admin.model"),
//   Notification: require("./notification.model"),
//   Conversation: require("./conversation"),
//   Group:require("./group"),
//   Chat:require("./chat")
// };
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Token } from "../models/token.model.js";

export { Admin, User, Token };
