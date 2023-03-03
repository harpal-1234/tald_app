const { userService, tokenService, dealsService } = require("../../services");
const config = require("../../config/config");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} = require("../../config/appConstants");
const { formatDeal,formatStoreDeal } = require("../../utils/commonFunction");
const {storeDistance}=require("../../utils/storeDistance");

const homeData = catchAsync(async (req, res) => {
  const data = await dealsService.homeData(req.query,req.token.user._id);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});
const categoryData=catchAsync(async (req, res) => {
  const data = await dealsService.categoryData(req.query,req.token.user._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const getCategoryData = catchAsync(async (req, res) => {
  const data = await dealsService.getCategoryData(req, res);
  const category = formatDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    category
  );
});

const nearestService = catchAsync(async (req, res) => {
  const data = await dealsService.nearestService(req, res);
  const nearYou = formatDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
   nearYou
  );
});
const storeAndDeals = catchAsync(async(req,res)=>{
  const {storeId,lat,long}=req.query;
  const userId = req.token.user._id;


  const data = await dealsService.getStoreAndDeals(storeId,lat,long,userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
   
  );

})

const purchaseDeal = catchAsync(async (req, res) => {
  const data = await dealsService.purchaseDeal(req.token.user._id, req.body.dealId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const storeDeal= catchAsync(async (req, res) => {
  const data = await dealsService.storeDeal(req.query.storeId);
  const user=await dealsService.recentlyView(req.query.storeId,req.token.user._id);
  // const store=await storeDistance(req.query.storeId,req.query.long,req.query.lat);
  const value=formatStoreDeal(data);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
     value,
    //  store
  );
});

const favouriteStore= catchAsync(async (req, res) => {
  const user=await dealsService.favouriteStore(req.body.storeId,req.token.user._id);
  if(user == true){
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.FAVORITE_DATA,
    user
  );}else{
    return successResponse(
      req,
      res,
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.FAVORITE_DATA_REMOVE,
      user
    )
  }
});
const bookNow = catchAsync(async(req,res)=>{
  const {deals,storeId}=req.body;
  const userId = req.token.user._id;
  const order = await dealsService.bookNow(deals,userId,storeId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    order
  );
});

const checkOut = catchAsync(async(req,res)=>{
  const {deals,storeId}=req.body;
  const userId = req.token.user._id;
  const order = await dealsService.checkOut(deals,userId,storeId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
})

const favoriteStore = catchAsync(async(req,res)=>{

  const userId = req.token.user._id;
  const store = await dealsService.favoriteStore(userId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    store
  );
})

// const  recentlyView= catchAsync(async (req, res) => {
//   const user=await dealsService.recentlyView(req.body.storeId,req.token.user._id);

// });

module.exports = {
  categoryData,
  homeData,
  getCategoryData,
  nearestService,
  purchaseDeal,
  storeDeal,
  favouriteStore,
  storeAndDeals,
  bookNow,
  checkOut,
  favoriteStore
};
