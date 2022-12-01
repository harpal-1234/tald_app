const { User, Store, Vendor, Token } = require("../../models");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");


const createStore = async (req, res) => {
  const vendor = await Vendor.findOne({
    _id: req.token.vendor._id,
    isDeletd: false,
  });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_EXIST
    );
  }
  const store = await Store.create({
    vendorId: vendor.id,
    service:req.body.service,
    storeName: req.body.storeName,
    location: {
      loc: {
        address: req.body.address,
        coordinates: [req.body.long, req.body.lat],
      },
    },
  });

  return store;
};

const editStoreDetails=async(data,tokenData)=>{
  const vendor=await Vendor.findOne({_id:tokenData.id,isDeleted:false});
  if(!vendor)
  {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
 
  const updateStore= await Store.findByIdAndUpdate({_id:data.id},
  {$set:{
   name:data.name,
   email:data.email,
   phoneNumber:data.phoneNumber
  }}
  )
  return updateStore;

};

const deleteStore= async (data, tokendata) => {
  const vendor = await Vendor.findOne({ _id: tokendata.id, isDeleted: false });
  if (!vendor) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const store= await Store.findOneAndUpdate(
    { _id: data.id ,vendorId:vendor.id},
    { isDeleted: true },
    { new: true }
  );
  if(!store)
  {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return store;
};
module.exports = {
  createStore,
  editStoreDetails,
  deleteStore
};
