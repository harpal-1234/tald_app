const {Store,User}=require("../models");
const { OperationalError } = require("./errors");
const {
    STATUS_CODES,
    SUCCESS_MESSAGES,
    USER_TYPE,
    ERROR_MESSAGES
  } = require("../config/appConstants");
const distance = require('google-distance-matrix');
 
  



const storeDistance=async(storeId,long,lat)=>{
    const store=await Store.findOne({_id:storeId,isDeleted:false});
    if(!store)
    {
        throw new OperationalError(
            STATUS_CODES.ACTION_FAILED,
            ERROR_MESSAGES.STORE_NOT_EXIST
          );

    }
    const storedata=store.location.loc.coordinates

    var origins = [long,lat];
  var destinations = storedata;
  var data;

   
 const data1=distance.matrix(origins, destinations, function (err, distances) {
      if (!err)
          data=distances;

         
  }
    
  );

  console.log(data,"data1");

  return data



}





module.exports={
    storeDistance
}


