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

const getUsers = async (userId, lat, long) => {
  // await User.createIndex({loc:"2dsphere"});
  const user = await User.findOne({ _id: userId, isDeleted: false }).lean();
  let distance;
  let measuring;
  user.seeDistance == "Km"
    ? ((measuring = "Km"), (distance = user.distance * 1000))
    : ((measuring = "Miles"), (distance = user.distance * 1600));

  // if (user.seeDistance == "Km") {
  //   distance = user.distance * 1000;
  //   measuring = "Km";
  // } else {
  //   distance = user.distance * 1600;
  //   measuring = "Miles";
  // }
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
      //sendRequests:{$nin:user.sendRequests},,
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
    }).lean();
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
  });
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
      { $push: { dislikes: id } },
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
const conversation = async (page, limit, userId) => {
  const skip = page * limit;
  // const user = await User.findOne({_id:userId,isDeleted:false});
  // console.log(user)
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
module.exports = {
  getUsers,
  filter,
  seeDistance,
  likeAndDislike,
  notification,
  conversation,
};