import { User, Project, Consultations } from "../../models/index.js";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
  OPTIONS,
  PROJECT_TYPE,
  PREFERENCES,
  PROJECT_SIZE,
  GOALS,
  STYLE,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import { formatUser } from "../../utils/commonFunction.js";
import moment from "moment";

export const getInteriorDesigners = async (
  type,
  lat,
  long,
  projectType,
  destination,
  consultationLength,
  minimumPrice,
  maximumPrice,
  preferences,
  styles,
  goals,
  projectSize,
  page,
  limit
) => {
  var query;
  var query1;
  var query2;
  if (type == "All") {
    query = ["Yes", "No"];
    query1 = ["Yes", "No"];
  }
  if (type == "VirtualConsultation") {
    query = ["Yes"];
    query1 = ["No", "Yes"];
  }
  if (type == "InteriorDesigner") {
    query = ["No", "Yes"];
    query1 = ["Yes"];
  }

  if (consultationLength == "25 mins") {
    query2 = {
      "virtual_Consultations.chargers_25_mins": { $nin: [null, ""] },
      "newClientProjects.chargers_25_mins": { $nin: [null, ""] },
      "destinationProject.chargers_25_mins": { $nin: [null, ""] },
      "destinationProject.chargers_25_mins": { $nin: [null, ""] },
    };
  }
  if (consultationLength == "55 mins") {
    query2 = {
      "virtual_Consultations.chargers_55_mins": { $nin: [null, ""] },
      "newClientProjects.chargers_55_mins": { $nin: [null, ""] },
      "destinationProject.chargers_55_mins": { $nin: [null, ""] },
      "destinationProject.chargers_55_mins": { $nin: [null, ""] },
    };
  }
  if (lat && long) {
    const designer = await User.find({
      // isApproved:true,
      isDeleted: false,
      isVerify: true,
      "virtual_Consultations.answer": { $in: query },
      "newClientProjects.answer": { $in: query1 },
      "projectType.answer": {
        $in: projectType
          ? [projectType]
          : [PROJECT_TYPE.COMMERCIAL, PROJECT_TYPE.RESIDENTIAL],
      },
      "destinationProject.answer": {
        $in: destination ? destination : [OPTIONS.YES, OPTIONS.NO],
      },
      ...query2,
      $and: [
        {
          minBudget: minimumPrice ? { $gte: minimumPrice } : { $gte: 0 },
          maxBudget: maximumPrice
            ? { $lte: maximumPrice }
            : { $lte: 1000000000000000 },
        },
      ],
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 1000000000000000,

          // $maxDistance:1000
        },
      },
      preferences: preferences
        ? { $in: JSON.parse(preferences) }
        : { $in: [...Object.values(PREFERENCES)] },
      projectSize: projectSize
        ? projectSize
        : {
            $in: [
              PROJECT_SIZE.FULL_RENOVATION,
              PROJECT_SIZE.NEW_BUILD,
              PROJECT_SIZE.PARTIAL_RENOVATION,
            ],
          },
      goals: goals
        ? { $in: JSON.parse(goals) }
        : { $in: [...Object.values(GOALS)] },
      styles: styles
        ? { $in: JSON.parse(styles) }
        : { $in: [...Object.values(STYLE)] },
    })
      .lean()
      .skip(page * limit)
      .limit(limit);
    if (designer.length > 0) {
      designer.forEach(async (value) => {
        const project = await Project.findOne({
          user: value._id,
          isDeleted: false,
        });
        delete value.__v;
        delete value.password;
        if (project) {
          if (project.images) {
            value.images = project.images;
          } else {
            value.images = [];
          }
        } else {
          value.images = [];
        }
      });
    }
    const total = await User.countDocuments({
      // isApproved:true,
      isDeleted: false,
      isVerify: true,
      "virtual_Consultations.answer": { $in: query },
      "newClientProjects.answer": { $in: query1 },
      "projectType.answer": {
        $in: projectType
          ? [projectType]
          : [PROJECT_TYPE.COMMERCIAL, PROJECT_TYPE.RESIDENTIAL],
      },
      "destinationProject.answer": {
        $in: destination ? destination : [OPTIONS.YES, OPTIONS.NO],
      },
      ...query2,
      $and: [
        {
          minBudget: minimumPrice ? { $gte: minimumPrice } : { $gte: 0 },
          maxBudget: maximumPrice
            ? { $lte: maximumPrice }
            : { $lte: 1000000000000000 },
        },
      ],
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 1000000000000000,

          // $maxDistance:1000
        },
      },
      preferences: preferences
        ? { $in: JSON.parse(preferences) }
        : { $in: [...Object.values(PREFERENCES)] },
      projectSize: projectSize
        ? projectSize
        : {
            $in: [
              PROJECT_SIZE.FULL_RENOVATION,
              PROJECT_SIZE.NEW_BUILD,
              PROJECT_SIZE.PARTIAL_RENOVATION,
            ],
          },
      goals: goals
        ? { $in: JSON.parse(goals) }
        : { $in: [...Object.values(GOALS)] },
      styles: styles
        ? { $in: JSON.parse(styles) }
        : { $in: [...Object.values(STYLE)] },
    });
    await formatUser(designer);
    return { designer, total };
  }
  const designer = await User.find({
    // isApproved:true,
    isDeleted: false,
    isVerify: true,
    "virtual_Consultations.answer": { $in: query },
    "newClientProjects.answer": { $in: query1 },
    "projectType.answer": {
      $in: projectType
        ? [projectType]
        : [PROJECT_TYPE.COMMERCIAL, PROJECT_TYPE.RESIDENTIAL],
    },
    "destinationProject.answer": {
      $in: destination ? destination : [OPTIONS.YES, OPTIONS.NO],
    },
    ...query2,
    $and: [
      {
        minBudget: minimumPrice ? { $gte: minimumPrice } : { $gte: 0 },
        maxBudget: maximumPrice
          ? { $lte: maximumPrice }
          : { $lte: 1000000000000000 },
      },
    ],
    preferences: preferences
      ? { $in: JSON.parse(preferences) }
      : { $in: [...Object.values(PREFERENCES)] },
    projectSize: projectSize
      ? projectSize
      : {
          $in: [
            PROJECT_SIZE.FULL_RENOVATION,
            PROJECT_SIZE.NEW_BUILD,
            PROJECT_SIZE.PARTIAL_RENOVATION,
          ],
        },
    goals: goals
      ? { $in: JSON.parse(goals) }
      : { $in: [...Object.values(GOALS)] },
    styles: styles
      ? { $in: JSON.parse(styles) }
      : { $in: [...Object.values(STYLE)] },
  })
    .lean()
    .skip(page * limit)
    .limit(limit);
  if (designer.length > 0) {
    await designer.forEach(async (value) => {
      console.log(designer);
      const project = await Project.findOne({
        user: value._id,
        isDeleted: false,
      });
      delete value.__v;
      delete value.password;
      if (project) {
        if (project.images) {
          value.images = project.images;
        } else {
          value.images = [];
        }
      } else {
        value.images = [];
      }
    });
  }
  const total = await User.countDocuments({
    // isApproved:true,
    isDeleted: false,
    isVerify: true,
    "virtual_Consultations.answer": { $in: query },
    "newClientProjects.answer": { $in: query1 },
    "projectType.answer": {
      $in: projectType
        ? [projectType]
        : [PROJECT_TYPE.COMMERCIAL, PROJECT_TYPE.RESIDENTIAL],
    },
    "destinationProject.answer": {
      $in: destination ? destination : [OPTIONS.YES, OPTIONS.NO],
    },
    ...query2,
    $and: [
      {
        minBudget: minimumPrice ? { $gte: minimumPrice } : { $gte: 0 },
        maxBudget: maximumPrice
          ? { $lte: maximumPrice }
          : { $lte: 1000000000000000 },
      },
    ],
    preferences: preferences
      ? { $in: JSON.parse(preferences) }
      : { $in: [...Object.values(PREFERENCES)] },
    projectSize: projectSize
      ? projectSize
      : {
          $in: [
            PROJECT_SIZE.FULL_RENOVATION,
            PROJECT_SIZE.NEW_BUILD,
            PROJECT_SIZE.PARTIAL_RENOVATION,
          ],
        },
    goals: goals
      ? { $in: JSON.parse(goals) }
      : { $in: [...Object.values(GOALS)] },
    styles: styles
      ? { $in: JSON.parse(styles) }
      : { $in: [...Object.values(STYLE)] },
  });
  await formatUser(designer);
  return { designer, total };
};
export const getInteriorDesignerById = async (designerId, page, limit) => {
  const designer = await User.findOne({
    _id: designerId,
    isVerify: true,
    // isApproved:true,
    isDeleted: false,
  }).lean();

  if (!designer) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const projects = await Project.find({ user: designerId, isDeleted: false })
    .lean()
    .skip(page * limit)
    .limit(limit);
  const totalProjects = await Project.countDocuments({
    user: designerId,
    isDeleted: false,
  });
  await formatUser(designer);
  return {
    designer: designer,
    projects: projects,
    totalProjects: totalProjects,
  };
};
export const saveProfile = async (designerId, userId) => {
  const check = await User.findOne({
    _id: designerId,
    isVerify: true,
    // isApproved:true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const designer = await User.findOneAndUpdate(
    {
      _id: userId,
      isVerify: true,
      // isApproved:true,
      isDeleted: false,
    },
    { $push: { saveProfile: designerId } },
    { new: true }
  );
  return;
};
export const getSlots = async (designerId, date, userId, timeDuration) => {
  const check = await User.findOne({
    _id: designerId,
    isDeleted: false,
    isVerify: true,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const availability = [
    {
      day: "Sunday",
      startTime: "6:30",
      endTime: "24:00",
      status: true,
    },
    {
      day: "Monday",
      startTime: "6:30",
      endTime: "24:00",
      status: true,
    },
    {
      day: "Tuesday",
      startTime: "6:30",
      endTime: "24:00",
      status: true,
    },
    {
      day: "Wednesday",
      startTime: "6:30",
      endTime: "24:00",
      status: true,
    },
    {
      day: "Thursday",
      startTime: "6:30",
      endTime: "23:00",
      status: true,
    },
    {
      day: "Friday",
      startTime: "6:30",
      endTime: "18:00",
      status: true,
    },
    {
      day: "Saturday",
      startTime: "6:30",
      endTime: "18:00",
      status: true,
    },
  ];
  const consultations = await Consultations.find({
    designer: designerId,
    isDeleted: false,
    isConfirm: true,
    isPast: false,
  })
    .distinct("confirmSlotTime")
    .lean();
  let count = 0;
  const dates = [];

  var nextDate = date;
  nextDate = new Date(nextDate);
  const testDay = moment(nextDate).format("dddd");
  for (let count = 0; count < 3; ) {
    let checkKey = false;
    if (count == 1) {
      nextDate.setHours(0, 0, 0, 0);
      nextDate.setDate(nextDate.getDate() + 1);
    }
    for (const val of availability) {
      if (val.status && val.day == testDay) {
        dates.push({
          date: new Date(nextDate),
          startTime: val.startTime,
          endTime: val.endTime,
        });
        // nextDate.setHours(0, 0, 0, 0);
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate = new Date(nextDate);
        count = count + 1;
        checkKey = true;
        console.log(nextDate);
      }
    }
    console.log(checkKey);
    if (checkKey == false) {
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      nextDate = nextDate;
    }
  }
  console.log(dates, count);
  const slots = [];
  for (date of dates) {
    const day = moment(date.date).format("dddd");
    var time;
    time = moment(date.date).format("HH:mm");
    var value;
    value = moment(date.date).format("mm");
    let subStruct;
    if (value <= 30) {
      subStruct = 30 - parseInt(value);
    } else {
      subStruct = 60 - parseInt(value);
    }

    const startTime = moment(date.startTime, "HH:mm");
    let time1 = moment(time, "HH:mm");

    var slotStartTime;

    if (time1.isBefore(startTime)) {
      const currentTime = moment(date.date);
      const startT = moment(startTime, "HH:mm");
      const timeDifference = startT.diff(currentTime);
      const newTime = currentTime.add(timeDifference, "milliseconds");
      slotStartTime = moment(newTime);
      console.log(slotStartTime, "slotTime");
    }
    console.log(date.date, "date");

    if (!slotStartTime) {
      slotStartTime = moment(date.date).add(subStruct, "minutes");
    }
    console.log(slotStartTime, "slotStart time ");
    const endTime = moment(date.endTime, "HH:mm");

    if (time1.isBefore(endTime)) {
      while (slotStartTime.isBefore(moment(endTime).subtract(29, "minutes"))) {
        let slotEndTime = moment(slotStartTime).add(1, "hour");
        if (slotEndTime.isAfter(endTime)) {
          slotEndTime = moment(endTime);
        }
        slots.push(moment(slotStartTime).format()),
          console.log(
            "Cut slot available:",
            moment(slotStartTime).format(),
            "to",
            slotEndTime.format("HH:mm")
          );
        slotStartTime.add(30, "minutes");
      }
    }
  }
  console.log(slots);
};
export const getSaveProfiles = async (page, limit) => {
  const check = await User.findOne({
    _id: designerId,
    isVerify: true,
    // isApproved:true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
};
