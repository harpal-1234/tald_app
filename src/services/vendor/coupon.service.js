const { Vendor ,Coupon,Token, User} = require("../../models");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const moment=require("moment");

const createCoupon=async(data,tokendata)=>{
   
    const vendor=await Vendor.findOne({_id:tokendata ,isDeleted:false}); 
    if(!vendor)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.ACCOUNT_NOT_EXIST
          );
    }

    const coupon=await Coupon.findOne({couponCode:data.couponCode,isDeleted:false});
    if(coupon)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.COUPON_CODE
          );
    }

    const newCoupon=await Coupon.create({
        vendorId:vendor.id,
        couponCode:data.couponCode,
        name:data.name,
        worth: data.worth,
        description: data.description,
        validFrom: moment(data.validFrom + "Z", "YYYY-MM-DD" + "Z").toDate(),
        validTo: moment(data.validTo+ "Z", "YYYY-MM-DD" + "Z").toDate()
    })
   
   
    return newCoupon
};


const getCoupon=async(data,tokendata)=>{
    
    const user=await Vendor.findOne({_id:tokendata,isDeleted:false});
    if(!user)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.USER_NOT_FOUND
          );
    }

    const coupon=await Coupon.findOne({couponCode:data.couponCode,isDeleted:false}).lean();
    if(!coupon)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.COUPON_DATA
          );
    }
    

    return coupon;

}

const deleteCoupon=async(data,tokendata)=>{
    
    const user=await Vendor.findOne({_id:tokendata,isDeleted:false});
    if(!user)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.USER_NOT_FOUND
          );
    }
   
    const coupon=await Coupon.findOneAndUpdate({_id:data.id},{isDeleted:true},{new:true});
 

    return coupon;

}

module.exports={
    createCoupon,
    getCoupon,
    deleteCoupon
}
