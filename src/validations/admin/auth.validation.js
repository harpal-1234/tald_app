import  Joi from "joi";
import  { JOI } from "../../config/appConstants.js";

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: JOI.PASSWORD,
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: JOI.PASSWORD,
    newPassword: JOI.PASSWORD,
  }),
};
const createGroup = {
  body: Joi.object().keys({
    groupName: Joi.string().required(),
    text: Joi.string().required(),
    image: Joi.string().required(),
  }),
};
const getGroup = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().required().allow(null, ""),
  }),
};
const getUser = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    search: Joi.string().required().allow(null, ""),
  }),
};
const allUser = {
  query: Joi.object().keys({
    search: Joi.string().required().allow(null, ""),
  }),
};
const userAction = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
const deleteGroup = {
  body: Joi.object().keys({
    groupId: Joi.string().required(),
  }),
};
export default{
  adminLogin,
  deleteGroup,
  userAction,
  allUser,
  getUser,
  getGroup,
  createGroup,
  changePassword
}