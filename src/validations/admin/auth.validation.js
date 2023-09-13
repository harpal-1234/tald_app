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
const requestAction = {
  body: Joi.object().keys({
    status: Joi.boolean().required().valid(true,false),
    requestId: Joi.string().required(),
  }),
};
const userAction = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
export default{
  adminLogin,
  getUsers,
  requestAction,
  userAction
}