// const socket = require("socket.io");
// const jwt = require("jsonwebtoken");
// const config = require("../config/config");
// const { userType } = require("../config/appConstants");
// const { socketService } = require("../services");
// const { formatDriverLoc } = require("./formatResponse");
 

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
let randomString = '';

for (let i = 0; i < 25; i++) {
  const randomIndex = Math.floor(Math.random() * charactersLength);
  randomString += characters.charAt(randomIndex);
}
console.log(randomString)
// let socketIds = [];
 
// /*
 
//    userCache ={
//        userId:socketId,
//        user2Id:socketId2
//    }
 
// */
 
// exports.connectSocket = (server) => {
//   io = socket(server);
 
//   io.use(function (socket, next) {
//     console.log("user tring to connect");
//     if (socket.handshake.query && socket.handshake.query.token) {
//       console.log("user enter");
//       jwt.verify(
//         socket.handshake.query.token,
//         config.jwt.secret,
//         function (err, decoded) {
//           if (err) return next(new Error("Authentication error"));
//           // console.log("decoded", decoded, "qqqqqqqqqqqqwwwwwwwwwweeeeerrrrrtyytyty");
//           socket.decoded = decoded;
//           let value = socket.decoded.user;
 
//           if (decoded.role == userType.ADMIN) {
//             socketIds.push(socket.id);
//           }
//           console.log("socketHolder", socketIds);
//           return next();
//         }
//       );
//     } else {
//       return next(new Error("Authentication error"));
//     }
//   }).on("connection", (socket) => {
//     socket.on("getLatLng", async (data) => {
//       console.log(data);
//       if (!data.lat || !data.lng) {
//         return console.log("Longitude and latitude is required");
//       }
//       let userId = socket.decoded.user;
//       await socketService.updateDiverLoc(userId, data.lat, data.lng);
//       const drivers = await socketService.getDrivers();
//       const formattedDriver = formatDriverLoc(drivers);
//       socketIds.map((id) => {
//         io.to(id).emit("receiveLatLng", formattedDriver);
//       });
 
//       var socketids = [];
//     });
//     socket.on("error", function (error) {
//       console.error(error, "something went wrong in socket");
//     });
//     socket.on("disconnect", async (data) => {
//       console.log("disconnect", socket.id);
//       socket.on
//       socketIds = socketIds.filter((socketId) => socketId !== socket.id);
//       console.log(socketIds);
//     });
//   });
// };









  

  // const [
  //   buffet,
  //   banner,
  //   men_clothing,
  //   resturant,
  //   bars,
  //   cannabis,
  //   shopping,
  //   beauty_spa,
  //   art_entertaiment,
  //   active_life,
  //   automotive,
  //   hotels,
  //   baby_kids,
  //   women_clothing,
  //   pets,
  //   electronics,
  //   sports_fitness,
  // ] = await Promise.all([
  //    Deal.find({service:{ categoryId : ""}, isDeleted: false}).lean(),
  //    Banner.find({service:{ categoryId:  },isDeleted:false}).lean(),
  //    Store.find({service:{ categoryId: },isDeleted:false}).lean(),
  //   await Store.find({service:{ categoryId: , query },isDeleted:false}).lean(),
  //   await Store.find({service:{ categoryId: }, isDeleted: false }).lean(),
  //   await Store.find({service:{ categoryId: }, isDeleted: false }).lean(),
  //   await Store.find({service:{ categoryId: }, isDeleted: false}).lean(),
  //   await Store.find({service:{ categoryId: }, isDeleted: false }).lean(),
  //   await Store.find({service:{
  //     categoryId: "Arts & Entertainment",
  //   }, isDeleted: false}).lean(),
  //   await Store.find({service:{ categoryId: "Active Life"}, isDeleted: false }).lean(),
  //   await Store.find({service:{ categoryId: "Automotive"}, isDeleted: false }).lean(),
  //   await Store.find({service:{ categoryId: "Hotels"}, isDeleted: false }).lean(),
  //   await Store.find({ service:{categoryId: "Baby & Kids"}, isDeleted: false }).lean(),
  //   await Store.find({service:{
  //     categoryId: "Women's Clothing"},
  //     isDeleted: false,
  //   }).lean(),
  //   await Store.find({service:{ categoryId: "Pets"}, isDeleted: false }).lean(),
  //   await Store.find({service:{categoryId: "Electronics"}, isDeleted: false }).lean(),
  //   await Store.find({service:{
  //     categoryId: "Sports & Fitness"},
  //     isDeleted: false,
  //   }).lean(),
  // ]);

  // bars,
  //   cannabis,
  //   shopping,
  //   beauty_spa,
  //   art_entertaiment,
  //   active_life,
  //   automotive,
  //   hotels,
  //   baby_kids,
  //   women_clothing,
  //   pets,
  //   electronics,
  //   sports_fitness;

  // const buffetDeals = formatDeal(buffet);
  // const bannerData = formatBanner(banner);
  // const manClothingData = formatStore(men_clothing);
  // const resturantData = formatResturant(resturant);
  // const barData = formatStore(bars);
  // const shoppingData = formatStore(shopping);
  // const beautySpaData = formatStore(beauty_spa);
  // const artEntertaimentData = formatStore(art_entertaiment);
  // const activeLifeData = formatStore(active_life);
  // const automotiveData = formatStore(automotive);
  // const hotelData = formatStore(hotels);
  // const babykidsData = formatStore(baby_kids);
  // const womenClothingData = formatStore(women_clothing);
  // const petsData = formatStore(pets);
  // const electronicsData = formatStore(electronics);
  // const sportsFitnessData = formatStore(sports_fitness);

//   return {
//     buffetDeals,
//     bannerData,
//     manClothingData,
//     resturantData,
//     barData,
//     shoppingData,
//     beautySpaData,
//     artEntertaimentData,
//     activeLifeData,
//     automotiveData,
//     hotelData,
//     babykidsData,
//     womenClothingData,
//     petsData,
//     electronicsData,
//     sportsFitnessData,
//   };


// const categoryData = await Category.find({ isDeleted: false });

// if(query)
// {

// const dealData = await Promise.all(
//   categoryData.map(async (data) => {
//     const val = data._id.toString();
//     const type = data.category;
//     const storeData = await Store.find({
//       service: { category: type, categoryId: val },
//       query,
//       isDeleted: false,
//     }).lean();
//     const store = formatStore(storeData);

//     return { type, store };
//   })
// );
// const bannerData = await Promise.all(
//   categoryData.map(async (data) => {
//     const val = data._id.toString();
//     const type = data.category;
//     const bannerValue = await Banner.find({
//       service: { category: type, categoryId: val },
//       isDeleted: false,
//     }).lean();
//     const banner = formatBanner(bannerValue);

//     return { category: type, banner };
//   })
// );

// dealData.push({ type: "Banner", bannerData });

// return dealData;
// }
// else{

// const dealData = await Promise.all(
//   categoryData.map(async (data) => {
//     const val = data._id.toString();
//     const type = data.category;
//     const storeData = await Store.find({
//       service: { category: type, categoryId: val },
//       isDeleted: false,
//     }).lean();
//     const store = formatStore(storeData);

//     return { type, store };
//   })
// );
// const bannerData = await Promise.all(
//   categoryData.map(async (data) => {
//     const val = data._id.toString();
//     const type = data.category;
//     const bannerValue = await Banner.find({
//       service: { category: type, categoryId: val },
//       isDeleted: false,
//     }).lean();
//     const banner = formatBanner(bannerValue);

//     return { category: type, banner };
//   })
// );

// dealData.push({ type: "Banner", bannerData });

// return dealData;
// }