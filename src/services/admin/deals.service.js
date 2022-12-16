const { Admin, Token, Banner, Category, Deal } = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");

const addCategory = async (categoryName) => {
  const category = await Category.findOne({ category: categoryName });
  if (category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS
    );
  }
  const addCategory = await Category.create({
    category: categoryName,
  });

  return addCategory;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_NOT_EXISTS
    );
  }
  const addCategory = await Category.findOneAndUpdate(
    { _id: category.id },
    {
      isDeleted: true,
    },
    { upsert: false }
  );

  return;
};

const getAllCategory = async (req, res) => {
  const category = await Category.find({ isDeleted: false }).lean();
  if (!category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_NOT_EXISTS
    );
  }
  return category;
};

const getAllDeal = async (req, res) => {
  const deal = await Deal.find({ isDeleted: false });
  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }

  return deal;
};

module.exports = {
  addCategory,
  deleteCategory,
  getAllCategory,
  getAllDeal,
};
