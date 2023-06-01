const { successResponse } = require("../../utils/response");
const {
  User,
  Deal,
  Store,
  Notification,
  Conversation,
} = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const { findOneAndUpdate } = require("../../models/token.model");
const calculateDistance = require("../../utils/distance");
const { date } = require("joi");

const getUsers = async (userId, lat, long) => {
  // await User.createIndex({loc:"2dsphere"});
  const user = await User.findOne({ _id: userId, isDeleted: false }).lean();
  let distance;
  let measuring;
  user.seeDistance == "Km"
    ? ((measuring = "Km"), (distance = user.distance * 1000))
    : ((measuring = "Miles"), (distance = user.distance * 1600));

  //     const currentDate = new Date();
  //     const nextWeekDate = new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000);
  //      const packageDate = nextWeekDate.toISOString();

  // console.log(packageDate)

  if (!lat && !long) {
    const long = user.location.coordinates[0];
    const lat = user.location.coordinates[1];
    const users = await User.find({
      _id: {
        $ne: user._id,
        $nin: [...user.sendRequests, ...user.dislikes],
      },
      pronoun: user.pronoun,
      politicalViews: user.politicalViews,
      sign: user.sign,
      age: { $gte: user.minAge, $lte: user.maxAge },
      prefrences: { $in: user.prefrences },
      pets: { $in: user.pets },
      lifeStyles: { $in: user.lifeStyles },
      drugUsages: { $in: user.drugUsages },
      hobbiesAndInterests: { $in: user.hobbiesAndInterests },
      lookingFor: { $in: user.lookingFor },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: distance,

          // $maxDistance:1000
        },
      },
      isDeleted: false,
    })
      .lean()
      .sort({ isBosted: 1 });
    users.forEach(async (element) => {
      const long = user.location.coordinates[0];
      const lat = user.location.coordinates[1];
      const lon1 = element.location.coordinates[0];
      const lat1 = element.location.coordinates[1];
      const distance = await calculateDistance.distance(
        lat,
        long,
        lat1,
        lon1,
        measuring
      );
      element.distance = distance;
    });
    const count = user.swipeCount - 10;
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { swipeCount: count },
      { new: true }
    );
    const date = new Date();
    if (user.packageDate < date) {
      const data = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        {
          packages: "Freemium",
          packageDate: "",
          packageAmount: 0,
          gifts: 0,
          giftDate: "",
          swipeCount: 60,
          isBoasted: false,
        }
      );
    }
    return users;
  }

  const users = await User.find({
    _id: {
      $ne: user._id,
      $nin: [...user.sendRequests, ...user.dislikes],
    },
    pronoun: user.pronoun,
    politicalViews: user.politicalViews,
    sign: user.sign,
    //likes: { $nin: user.likes },
    age: { $gte: user.minAge, $lte: user.maxAge },
    prefrences: { $in: user.prefrences },
    pets: { $in: user.pets },
    lifeStyles: { $in: user.lifeStyles },
    drugUsages: { $in: user.drugUsages },
    hobbiesAndInterests: { $in: user.hobbiesAndInterests },
    lookingFor: { $in: user.lookingFor },
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [long, lat],
        },
        $maxDistance: distance,

        // $maxDistance:1000
      },
    },
    isDeleted: false,
  })
    .lean()
    .sort({ isBosted: 1 });
  users.forEach(async (element) => {
    const lon1 = element.location.coordinates[0];
    const lat1 = element.location.coordinates[1];
    const distance = await calculateDistance.distance(
      lat,
      long,
      lat1,
      lon1,
      measuring
    );
    element.distance = distance;
  });
  const count = user.swipeCount - 10;
  await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { swipeCount: count },
    { new: true }
  );
  const date = new Date();
  if (user.packageDate < date) {
    const data = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        packages: "Freemium",
        packageDate: "",
        packageAmount: 0,
        gifts: 0,
        giftDate: "",
        swipeCount: 60,
        isBoasted: false,
      }
    );
  }
  return users;
};
const filter = async (distance, minAge, maxAge, userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      distance: distance,
      maxAge: maxAge,
      minAge: minAge,
    },
    { new: true }
  );
  console.log(user);
  return user;
};
const seeDistance = async (type, userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      seeDistance: type,
    },
    { new: true }
  );

  return user;
};
const likeAndDislike = async (type, id, userId) => {
  const check = await User.findOne({ _id: id, isDeleted: false });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  if (type == "Like") {
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (user.swipeCount <= 0) {
      throw new OperationalError(
        STATUS_CODES.TOO_MANY_REQUESTS,
        ERROR_MESSAGES.LIMIT
      );
    }
    if (JSON.stringify(user.likes).includes(id)) {
      await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { $push: { sendRequests: id, matches: id } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $push: { likes: userId, matches: userId } },
        { new: true }
      );
      const notifyToMatch = await Notification.create({
        userId: userId,
        message:
          "you matched with " +
          user.name +
          " .Congratz! You are ready to start a conversation",
        type: "match",
      });
      const notifyToSelf = await Notification.create({
        userId: id,
        message:
          "you matched with " +
          check.name +
          " .Congratz! You are ready to start a conversation",
        type: "match",
      });
      const time = new Date();
      const conversation = await Conversation.create({
        sender: userId,
        receiver: id,
        message: "",
        messageType: "",
        messageTime: time,
      });
      await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        {
          $push: {
            notifications: {
              $each: [{ notificationId: notifyToSelf._id }],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $push: {
            notifications: {
              $each: [{ notificationId: notifyToMatch._id }],
              $position: 0,
            },
          },
        },
        { new: true }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { $push: { sendRequests: id } }
      );
      await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $push: { likes: userId } },
        { new: true }
      );
    }
  }
  if (type == "Dislike") {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $push: { dislikes: id, rewind: { $each: [id], $position: 0 } } },
      { new: true }
    );
    // await User.findOneAndUpdate(
    //   { _id: id, isDeleted: false },
    //   { $push: { likes: userId } },
    //   { new: true }
    // );
  }
};
const notification = async (page, limit, Id) => {
  const skip = page * limit;
  const data = await User.findOne(
    { _id: Id },
    { ["notifications"]: { $slice: [skip, limit] }, _id: 1 }
  ).populate({
    path: "notifications.notificationId",

    select: ["userId", "message", "type", "createdAt", "isRequest"],
    populate: [
      {
        path: "userId",
        select: ["email", "name", "images"],
      },
    ],
  });

  return data.notifications;
};
const oneNotification = async (Id) => {
  const data = await Notification.findByIdAndUpdate(
    { _id: Id, isDeleted: false },
    { isSeen: true },
    { new: true }
  );

  return data;
};
const conversation = async (page, limit, userId) => {
  const skip = page * limit;
  const data = await Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }],
    isDeleted: false,
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ _id: 1 })
    .populate([
      { path: "sender", select: ["name", "images", "email"] },
      { path: "receiver", select: ["name", "images", "email"] },
    ]);
  if (data.length > 0) {
    data.forEach((val) => {
      const pic = val.sender.images[0];
      val.sender.image = pic.image;
      delete val.sender.images;
      const pic1 = val.receiver.images[0];
      val.receiver.image = pic1.image;
      delete val.receiver.images;
    });
    return data;
  } else {
    return [];
  }
};
const checkOut = async (userId, packageType, packageAmount, plan) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).lean();
  if (user.isTrail == true) {
    const date = new Date();
    if (user.isActiveTrail == false) {
      const currentDate = new Date();
      const tomorrowDate = new Date(
        currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
      );
      const swipeDate = tomorrowDate.toISOString();
      var count;
      if (packageType == "Silver") {
        count = 210;
      }
      if (packageType == "Gold") {
        count = 510;
      }
      if (packageType == "Platinum") {
        count = 5000000000000000;
      }
      const todayDate = new Date();
      const nextThreeDayDate = new Date(
        todayDate.getTime() + 3 * 24 * 60 * 60 * 1000
      );
      const threeDayDate = nextThreeDayDate.toISOString();
      await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        {
          trailDate: threeDayDate,
          //packageDate: packageDate,
          packages: packageType,
          swipeCount: count,
          swipeDate: swipeDate,
          // packageAmount: packageAmount,
          isActiveTrail: true,
          plan: plan,
        },
        { new: true }
      );
    }
    if (user.trailDate < date) {
      await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { isTrail: false }
      );
    }
  } else {
    var packageDate;
    var boastDate;
    var count;
    const currentDate1 = new Date();
    const nextWeekDate = new Date(
      currentDate1.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const giftDate = nextWeekDate.toISOString();
    if (packageType == "Gold" || packageType == "Platinum") {
      const currentDate = new Date();
      const twoDayAgo = new Date(
        currentDate.getTime() + 2 * 24 * 60 * 60 * 1000
      );
      const fiveDayAgo = new Date(
        currentDate.getTime() + 5 * 24 * 60 * 60 * 1000
      );
      boastDate =
        packageType == "Gold"
          ? twoDayAgo.toISOString()
          : fiveDayAgo.toISOString();
    }
    if (packageType == "Silver") {
      giftCount = 3;
      count = 210;
    }
    if (packageType == "Gold") {
      giftCount = 5;
      count = 510;
    }
    if (packageType == "Platinum") {
      giftCount = 15;
      count = 50000000000000;
    }
    if (plan == "Weekly") {
      const currentDate = new Date();
      const nextWeekDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      packageDate = nextWeekDate.toISOString();
    }
    if (plan == "Monthly") {
      const currentDate = new Date();
      const nextMonthDate = new Date(
        currentDate.getTime() + 28 * 24 * 60 * 60 * 1000
      );
      packageDate = nextMonthDate.toISOString();
    }
    if (plan == "Annualy") {
      const currentDate = new Date();
      const nextYearDate = new Date(
        currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
      );
      packageDate = nextYearDate.toISOString();
    }
    // console.log(formattedDate);
    const currentDate = new Date();
    const tomorrowDate = new Date(
      currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
    );
    const swipeDate = tomorrowDate.toISOString();
    const data = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        packageDate: packageDate,
        packages: packageType,
        packageAmount: packageAmount,
        plan: plan,
        isBoasted: !boastDate ? false : true,
        boastDate: boastDate,
        swipeCount: count,
        giftCount: giftCount,
        giftDate: giftDate,
        swipeDate: swipeDate,
      },
      { new: true }
    );
  }
};
const rewind = async (userId, page, limit) => {
  const skip = page * limit;
  const check = await User.findOne({ _id: userId, isDeleted: false });
  const user = await User.findOne(
    { _id: userId, isDeleted: false },
    { rewind: { $slice: [skip, limit] } }
  )
    .populate({ path: "rewind" })
    .lean();
  if (
    check.packages == "Silver" ||
    check.packages == "Gold" ||
    check.packages == "Platinum"
  ) {
    return user.rewind;
  } else {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.UPGRATE
    );
  }
};
const checkApp = async (userId) => {
  const user = await User.find({ _id: userId, isDeleted: false }).lean();
  const date = new Date();
  if (user.swipeDate <= date || !user.swipeDate) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const tomorrowISOString = currentDate.toISOString();
    if (user.packages == "Freemium") {
      const date = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { swipeDate: tomorrowISOString, swipeCount: 60 }
      );
    }
    if (user.packages == "Silver") {
      const date = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { swipeDate: tomorrowISOString, swipeCount: 210 }
      );
    }
    if (user.packages == "Gold") {
      const date = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { swipeDate: tomorrowISOString, swipeCount: 510 }
      );
    }
    if (user.packages == "Platinum") {
      const date = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { swipeDate: tomorrowISOString, swipeCount: 5000000000000000 }
      );
    }
    const data = await User.findOne({ _id: userId, isDeleted: false });
    const swipeCount = data.swipeCount - 10;
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { swipeCount: swipeCount },
      { new: true }
    );
  }
  if (user.boastDate < date) {
    const val = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isBoasted: false }
    );
  }
  if (user.giftDate < date) {
    const currentDate1 = new Date();
    const nextWeekDate = new Date(
      currentDate1.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const giftDate = nextWeekDate.toISOString();
    if (user.packages == "Silver" || user.packages == "Gold") {
      const val = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { giftDate: giftDate, gifts: user.packages == "Silvre" ? 3 : 5 }
      );
    }
    if (user.packages == "Platinum") {
      const val = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { giftDate: giftDate, gifts: 15 }
      );
    }
  }
};
const oneUser = async (userId, Id) => {
  const check = await User.findOne({ _id: userId, isDeleted: false }).lean();
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  if (check.viewProfile) {
    if (!JSON.stringify(check.viewProfile).includes(JSON.stringify(Id))) {
      const user = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { $push: { viewProfile: { user: Id } } },
        { new: true }
      );

      const notification = await Notification.create({
        message: "Someone viewed your profile",
        userId: Id,
        type: "viewProfile",
      });
      const data = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        {
          $push: {
            notifications: {
              $each: [{ notificationId: notification._id }],
              $position: 0,
            },
          },
        }
      );
    }

    return check;
  }
  const arr = [];
  return arr;
};
const upComingLikes = async (page, limit, userId) => {
  const skip = page * limit;
  const check = await User.findOne({ _id: userId, isDeleted: false }).lean();
  const users = await User.findOne(
    { _id: userId, isDeleted: false },
    { likes: { $slice: [skip, limit] } }
  ).populate({
    path: "likes",
  });
  if (check.packages == "Gold" || check.packages == "Platinum") {
    return users;
  } else {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.UPGRATE
    );
  }
};

module.exports = {
  getUsers,
  filter,
  seeDistance,
  likeAndDislike,
  notification,
  conversation,
  checkOut,
  rewind,
  checkApp,
  oneUser,
  upComingLikes,
  oneNotification,
  
};
