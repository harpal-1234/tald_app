const { Admin, User } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment = require("moment");
const { formatUser } = require("../../utils/commonFunction");
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

const getAllUser = async (page, limit, search, startDate, endDate) => {
  let skip = page * limit;
  if (startDate && endDate) {
    const dateObject = new Date(startDate);
    const startdate = dateObject.toISOString();

    const dateObject1 = new Date(endDate);
    const enddate = dateObject1.toISOString();

    const value = await  User.find({
      isDeleted: false,
      type: "User",
      createdAt: { $gte: startdate, $lte: enddate },
    }) .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .lean();
    let total = await User.countDocuments({
      isDeleted: false,
      type: "User",
      createdAt: { $gte: startdate, $lte: enddate },
    });
    const users = formatUser(value)
    return {users,total};
    return {users,total};
  }
  if (search) {
    let value = await User.find({
      $or: [
        { email: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
      ],
      type: "User",
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
      type: "User",
      isDeleted: false,
    }).skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .lean();
    const users = formatUser(value)
    return { users, total };
  } else {
    var value = await User.find({ type: "User", isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    let total = await User.countDocuments({ isDeleted: false ,type:"User"});
    const users = formatUser(value)
    return {users, total };
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
const userAction = async(userId)=>{
  const check = await User.findOne({_id:userId,isDeleted:false});
  if(!check){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  if(check.isBlocked == false){
    const user = await User.findOneAndUpdate({_id:userId,isDeleted:false},{isBlocked:true});
    return "User Blocked sucessfully "
  }
  if(check.isBlocked == true){
    const user = await User.findOneAndUpdate({_id:userId,isDeleted:false},{isBlocked:false});
    return "User unBlocked sucessfully "
  }
}
const userOrderDetails = async(userId)=>{
  const check = await User.findOne({_id:userId,isDeleted:false})
  if(!check){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ORDER_NOT_FOUND
    );
  };
  const orders = await User.findOne({_id:userId,isDeleted:false}).populate([{
    path:"dealPurchases.deals.dealId",
    select:["service","dealId","title","totalPrice","discountPrice","description","inclusions","no_of_person"]
  
  },{
    path:"dealPurchases.storeId",
    select:["vendor"],
    populate:{
      path:"vendor",
      select:"name"
    }
  }]).lean();
  const users = formatUser(orders)
  return users;
}
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
  userAction,
  userOrderDetails

};
