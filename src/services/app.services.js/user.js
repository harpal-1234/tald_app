import {
  User,
  Project,
  Consultations,
  ProjectInquery,
  projectRequest,
} from "../../models/index.js";
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
import {
  formatUser,
  formatProjectInquery,
} from "../../utils/commonFunction.js";
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
export const getInteriorDesignerById = async (
  designerId,
  page,
  limit,
  userId
) => {
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
  if (userId) {
    projects.forEach((val) => {
      if (val.likedBy) {
        if (JSON.stringify(val.likedBy).includes(userId)) {
          val.isLike = true;
        } else {
          val.isLike = false;
        }
      }
    });
  }
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
  if (!JSON.stringify(check.weeklySchedule).includes(true)) {
    return [];
  }
  const consultations = await Consultations.find({
    designer: designerId,
    isDeleted: false,
    isConfirm: true,
    isPast: false,
  })
    .distinct("confirmSlotTime")
    .lean();

  const dates = [];

  var nextDate = date;
  nextDate = new Date(nextDate);
  var testDay;
  testDay = moment(nextDate).format("dddd");

  for (let count = 0; count < 3; ) {
    let checkKey = false;
    if (count == 1) {
      nextDate.setHours(0, 0, 0, 0);
      nextDate.setDate(nextDate.getDate());
      testDay = moment(nextDate).format("dddd");
    }
    for (const val of check.weeklySchedule) {
      if (val.status && val.day == testDay && count < 3) {
        dates.push({
          date: moment(new Date(nextDate)),
          startTime: val.startTime,
          endTime: val.endTime,
        });
        nextDate.setHours(0, 0, 0, 0);
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate = new Date(nextDate);
        moment(nextDate).format("dddd");
        //console.log(nextDate,"nnnnnnnnnnnnnnn",moment(nextDate).format("dddd"))
        testDay = moment(nextDate).format("dddd");

        count = count + 1;
        checkKey = true;
        console.log(nextDate);
      }
    }
    console.log(checkKey);
    if (checkKey == false) {
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      testDay = moment(nextDate).format("dddd");
      console.log(nextDate, "nnnnnnnnnnnnnnn");
      nextDate = new Date(nextDate);
    }
  }
  console.log(dates);
  const slots = [];

  for (date of dates) {
    console.log(date);
    const day = moment(date.date).format("dddd");
    var time;
    time = moment(date.date);
    var value;
    value = moment(date.date).format("mm");
    let subStruct;
    if (value <= 30) {
      subStruct = 30 - parseInt(value);
    } else {
      subStruct = 60 - parseInt(value);
    }
    const parsedDateTime = moment(date.date);
    parsedDateTime.set({
      hour: moment(date.startTime, "HH:mm").hour(),
      minute: moment(date.startTime, "HH:mm").minute(),
    });

    // Format the updated date-time string
    const startTime = parsedDateTime.format();
    let time1 = moment(time);
    console.log(time1, "ggggggggggggg", startTime);
    var slotStartTime;

    if (time1.isBefore(startTime)) {
      const currentTime = moment(date.date);
      const startT = moment(startTime);
      const timeDifference = startT.diff(currentTime);
      const newTime = currentTime.add(Math.abs(timeDifference), "milliseconds");
      slotStartTime = moment(newTime);
    }
    if (!slotStartTime) {
      slotStartTime = moment(date.date).add(subStruct, "minutes");
    }
    console.log(slotStartTime, "slotStart time ");
    const parsedDateTime1 = moment(date.date);
    parsedDateTime1.set({
      hour: moment(date.endTime, "HH:mm").hour(),
      minute: moment(date.endTime, "HH:mm").minute(),
    });

    // Format the updated date-time string
    const endTime = parsedDateTime1.format();

    if (time1.isBefore(endTime)) {
      while (slotStartTime.isBefore(moment(endTime).subtract(29, "minutes"))) {
        let slotEndTime = moment(slotStartTime).add(1, "hour");
        if (slotEndTime.isAfter(endTime)) {
          slotEndTime = moment(endTime);
        }

        // console.log(
        //   "Cut slot available:",
        //   moment(slotStartTime),
        //   "to",
        //   slotEndTime.format("HH:mm")
        // );
        slots.push(moment(slotStartTime).format());
        slotStartTime.add(30, "minutes");
      }
    }
  }
  const data = await Consultations.find({
    designer: designerId,
    isPast: false,
    isConfirm: true,
  })
    .distinct("confirmSlotTime")
    .lean();
  console.log(data);
  if (timeDuration == "25_mins") {
    const timeSlots = slots.filter((date) => !data.includes(date));
    return timeSlots;
  } else {
    function isWithin30Minutes(date1, date2) {
      const dateA = new Date(date1);
      const dateB = new Date(date2);
      const diffInMilliseconds = Math.abs(dateA - dateB);
      const diffInMinutes = diffInMilliseconds / (1000 * 60);
      return diffInMinutes <= 30;
    }
    const result = slots.filter((date1) => {
      const matchingDate = data.find((date2) =>
        isWithin30Minutes(date1, date2)
      );
      return !matchingDate;
    });
    return result;
  }
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
export const bookConsultations = async (
  designerId,
  timeSlots,
  projectSummary,
  userId,
  files,
  durationTime
) => {
  const check = await User.findOne({
    _id: designerId,
    isVerify: true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const data = await Consultations.create({
    designer: designerId,
    timeSlots: timeSlots,
    projectSummary: projectSummary,
    user: userId,
    files: files,
    durationTime: durationTime,
  });
  return data;
};
export const getConsultations = async (page, limit, clientId) => {
  const date = new Date();
  const currentDate = moment(date).format();
  await Consultations.updateMany(
    {
      isDeleted: false,
      isConfirm: true,
      confirmSlotTime: { $lt: currentDate },
    },
    { $set: { isPast: true, isConfirm: false } }
  );
  console.log(clientId, "jkkkkkkkkh");
  const [UpcomingConsultation, pastConsultations] = await Promise.all([
    Consultations.find({
      user: clientId,
      isDeleted: false,
      isPast: false,
    })
      .skip(page * limit)
      .limit(limit)
      .sort({ _id: -1 })
      .lean()
      .populate({
        path: "designer",
        select: ["_id", "email", "name"],
      }),
    Consultations.find({
      user: clientId,
      isDeleted: false,
      isPast: true,
    })
      .skip(page * limit)
      .limit(limit)
      .sort({ _id: -1 })
      .lean()
      .populate({
        path: "designer",
        select: ["_id", "email", "name"],
      }),
  ]);
  const consultations = [
    {
      type: "UpcomingConsultations",
      value: UpcomingConsultation,
    },
    {
      type: "pastConsultations",
      value: pastConsultations,
    },
  ];
  return consultations;
};
export const createProjectInquery = async (body, userId) => {
  body.user = userId;
  body.isVerify = true;
  const project = await ProjectInquery.create(body);
  return project;
};
export const getInqueryStatus = async (projectId) => {
  const project = await projectRequest
    .find({
      projectId: projectId,
      isDeleted: false,
    })
    .populate({ path: "designer", select: ["name", "email", "_id"] })
    .sort({ _id: -1 });
  if (!project) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }

  return project;
};
export const submitProjectInquery = async (projectId, designerId, userId) => {
  const check = await User.findOne({
    _id: designerId,
    isVerify: true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const date = new Date();
  const data = await projectRequest.create({
    user: userId,
    designer: designerId,
    projectId: projectId,
    inqueryTime: moment(date).format(),
    status: "Pending",
    isVerify: true,
  });
  // const project = data.toObject();
  // await formatProjectInquery(project);

  return data;
};
export const getProjectInqueries = async (page, limit, userId) => {
  const projects = await ProjectInquery.find({ user: userId, isDeleted: false })
    .lean()
    .skip(page * limit)
    .limit(limit);
  await formatProjectInquery(projects);

  return projects;
};
export const editProjectInquery = async (body, userId) => {
  const projectId = body.projectId;
  body.user = userId;
  delete body.projectId;

  const check = await ProjectInquery.findOne({
    _id: projectId,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }
  const projects = await ProjectInquery.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    { body },
    { new: true }
  );
  await formatProjectInquery(projects.toObject());

  return projects;
};
