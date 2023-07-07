import  Joi from "joi";
import  { JOI } from "../../config/appConstants.js";

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};
const getUsers = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
export default{
  adminLogin,
  getUsers
}