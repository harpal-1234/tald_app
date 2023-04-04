const { Admin, Token, Banner, Category, Deal } = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  DELETE_MASSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment=require("moment");

const addCategory = async (categoryName) => {
  const category = await Category.findOne({ category: categoryName });
  if (category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS
    );
  }
  // if(cannabisCategoryData.loweCase)
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

const editDeal=async(bodyData)=>{

  const deal = await Deal.findOne({ _id: bodyData.id, vendorId:bodyData.vendorId,isDeleted: false });
  if (!deal) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const validFromDate=moment(bodyData.validFrom).format("YYYY-MM-DD");
  const validToDate=moment(bodyData.validTo).format("YYYY-MM-DD");
  
  
  const editDeal = await Deal.findOneAndUpdate({_id: bodyData.id},{
    vendorId: bodyData.vendorId,
    couponCode: bodyData.couponCode,
    category: bodyData.category,
    storeId:bodyData.storeId,
    name: bodyData.name,
    worth: bodyData.worth,
    quantity:bodyData.quantity,
    description: bodyData.description,
    validFrom: moment(validFromDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
    validTo: moment(validToDate + "Z", "YYYY-MM-DD" + "Z").toDate(),
  },{upsert:false,new:true});

 

  return editDeal;

};

const deleteDeal = async (dealId) => {
  const dealData = await Deal.findOne({ _id:dealId, isDeleted: false });
  if (!dealData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }

  const deal = await Deal.findOneAndUpdate(
    { _id: dealData.id },
    { isDeleted: true },
    { new: true }
  );

  return deal;
};
const dealAction = async (dealId) => {
  const dealData = await Deal.findOne({ _id:dealId, isDeleted: false });
  if (!dealData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }
if(dealData.isActive == true){
  const deal = await Deal.findOneAndUpdate(
    { _id: dealData.id },
    { isActive: false ,status:"deactivate"},
    { new: true }
  );
  return "disabled successfully"
}

if(dealData.isActive == false){
  const deal = await Deal.findOneAndUpdate(
    { _id: dealData.id },
    { isActive: true ,status:"activate"},
    { new: true }
  );
  return "enabled successfully"
}
};
const editCategory=async (data) => {
  const category = await Category.findOne({ _id:data.categoryId, isDeleted: false });
  if (!category) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DEAL_NOT_EXISTS
    );
  }

  const deal = await Category.findOneAndUpdate(
    { _id: category.id },
    { categoryImage: data.categoryImage },
    { new: true }
  );

  return deal;
};

module.exports = {
  addCategory,
  deleteCategory,
  getAllCategory,
  getAllDeal,
  editDeal,
  deleteDeal,
  editCategory,
  dealAction
};
