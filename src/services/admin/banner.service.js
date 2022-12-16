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

const deleteBanner = async (req, res) => {
  const banner = await Banner.findOne({ _id: req.query.id, isDeleted: false });
  if (!banner) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.BANNER_NOT_EXISTS
    );
  }
  const deleteBanner = await Banner.findOneAndUpdate(
    { _id: banner.id },
    {
      isDeleted: true,
    },
    { new: true, upsert: false }
  );
  return deleteBanner;
};

module.exports = {
  bannerAction,
  bannerRequest,
  deleteBanner,
};
