const { Admin, User } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const createUser = async (data) => {
  const user = await User.findOne({ email: data.email, isDeleted: false });
  if (user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  const newUser = await User.create(data);
  return newUser;
};

const getAllUser= async (req, res) => {
  let { page, limit, search } = req.query;
  let skip = page * limit;
  if (search) {
    let userData = await User.find({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await User.countDocuments({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      isDeleted: false,
    });

    return { total, userData };
  } else {
    var userData = await User.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await User.countDocuments({ isDeleted: false });

    return { total, userData };
  }
};

const editUserProfile = async (req, res) => {
  const userData = await User.findOne({
    _id: req.body.id,
    isDeleted: false,
  });
  console.log(userData);

  if (!userData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const valueData = await User.findOne({ email: req.body.email });

  if (valueData) {
    if (userData.email !== valueData.email) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST
      );
    }
  }

  const user = await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      email: req.body.email,
      name: req.body.name,
    },
    {
      upsert: false,
    }
  );
  return;
};

const deleteUser = async (req, res) => {
  const userData = await User.findOne({
    _id: req.query.id,
    isDeleted: false,
  });

  if (!userData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOneAndUpdate(
    { _id: req.query.id },
    {
      isDeleted: true,
    },
    {
      upsert: false,
    }
  );
  return;
};

module.exports = {
  createUser,
  getAllUser,
  deleteUser,
  editUserProfile,
};
