const { Admin, Token, Banner } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");


const bannerRequest = async (req, res) => {
  const bannerRequest = await Banner.find({
    status: "pending",
    isDeleted: false,
  });
  return bannerRequest;
};

const bannerAction = async (req, res) => {
  const bannerRequest = await Banner.findOneAndUpdate(
    { $and: [{ _id: req.body.id }, { status: "pending" }] },
    { status: req.body.status },
    { new: true }
  );
  return bannerRequest;
};

module.exports={
    bannerAction,
    bannerRequest
}