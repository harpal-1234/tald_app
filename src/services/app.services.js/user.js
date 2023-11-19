import {
  User,
  Project,
  Consultations,
  ProjectInquery,
  projectRequest,
  Review,
  Payment,
} from "../../models/index.js";
import momentTz from "moment-timezone";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import {
  formatUser,
  formatProjectInquery,
  formatProjects,
} from "../../utils/commonFunction.js";
import moment from "moment";
import * as sendEmail from "../../utils/sendMail.js";
import { payment } from "../user/auth.service.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51NuIYPKs8Y4Y2av4NWgrHFmq8R42IrEiIZ4c8jAsc23JsPqeq60bX7uKZZGb24dujnaheL7J6WsisNUtrJof0wlq00jvt0higK"
);
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
  limit,
  needHelp,
  fullServiceClients,
  startDate,
  endDate,
  userId,
  AcceptVirtualConsultation,
  feeStructure
) => {
  var query;
  var query1;
  var query3;
  [];
  var query2;
  if (type == "All") {
    query = ["Yes", "No", ""];
    query1 = ["Yes", "No", ""];
  }
  if (type == "VirtualConsultation") {
    query = ["Yes"];
    query1 = ["No", "Yes", ""];
  }
  if (type == "InteriorDesigner") {
    query = ["No", "Yes", ""];
    query1 = ["Yes"];
  }
  if (startDate && endDate && type == "VirtualConsultation") {
    console.log(endDate);
    const startDate1 = new Date(startDate);
    const endDate1 = new Date(endDate);
    query3 = {
      $and: [
        { "availability.startDate": { $lte: endDate1 } },
        {
          "availability.endDate": { $gte: startDate1 },
        },
      ],
    };
  }

  console.log(query3);
  if (consultationLength) {
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
  }
  var options = {
    isApproved: true,
    isDeleted: false,
    // isVerify: true,
    isSignUp: true,
  };
  if (projectType) {
    options["projectType.answer"] = projectType;
  }
  if (destination) {
    options["destinationProject.answer"] = destination;
  }
  if (preferences) {
    options.preferences = { $in: JSON.parse(preferences) };
  }
  if (needHelp) {
    options.needHelp = { $in: JSON.parse(needHelp) };
  }
  if (projectSize) {
    options.projectSize = { $in: JSON.parse(projectSize) };
  }
  if (goals) {
    options.goals = { $in: JSON.parse(goals) };
  }
  if (styles) {
    options.styles = { $in: JSON.parse(styles) };
  }
  if (fullServiceClients) {
    options.fullServiceClients = { $in: fullServiceClients };
  }
  if (feeStructure) {
    options["feeStructure.answer"] = { $in: JSON.parse(feeStructure) };
  }
  if ((lat, long)) {
    options.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [long, lat],
        },
        $maxDistance: 1000000000,
        // $maxDistance:1000
      },
    };
  }
  if (maximumPrice && minimumPrice) {
    options.$and = [
      {
        minBudget: minimumPrice ? { $gte: minimumPrice } : { $gte: 0 },
        maxBudget: maximumPrice
          ? { $lte: maximumPrice }
          : { $lte: 1000000000000000 },
      },
    ];
  }
  // if (virtual_Consultations.answer) {
  //   options.virtual_Consultations.answer=
  // }
  console.log(options.location);

  const designer = await User.find({
    ...options,
    ...query2,
    ...query3,
  })
    .lean()
    .skip(page * limit)
    .limit(limit)
    .sort({ _id: -1 });
  var check;
  if (userId) {
    check = await User.findOne({
      _id: userId,
      isDeleted: false,
      // isVerify: true,
    });
  }
  console.log(designer);
  if (designer?.length > 0) {
    Promise.all(
      await designer.forEach(async (value) => {
        const project = await Project.findOne({
          user: value._id,
          isDeleted: false,
          "images.image": { $exists: true },
        }).sort({ _id: -1 });
        delete value.__v;
        delete value.password;
        if (check && JSON.stringify(check?.saveProfiles)?.includes(value._id)) {
          value.isSaveProfile = true;
        } else {
          value.isSaveProfile = false;
        }
        if (project) {
          if (project.images) {
            value.images = project.images;
          } else {
            value.images = [];
          }
        } else {
          value.images = [];
        }
        console.log(
          check && JSON.stringify(check?.saveProfiles)?.includes(value._id)
        );
      })
    );
  }

  const total = await User.count({
    ...options,
    ...query2,
    ...query3,
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
    //isVerify: true,
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
    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
      // isVerify: true,
    }).lean();
    // console.log(user?.saveProfiles ? user?.saveProfiles : [], "jjjjjjjjjjjj");
    if (user && JSON.stringify(user?.saveProfiles)?.includes(designerId)) {
      console.log("jnfjjnjfjnnjfvfvlmfnknlfknknn");
      designer.isSaveProfile = true;
    } else {
      console.log("jnfjjnjfjnnjfvfvlmfnuuuuuuuuu");
      designer.isSaveProfile = false;
    }
    projects?.forEach((val) => {
      if (JSON.stringify(user?.saveImages).includes(val?._id)) {
        val.isLike = true;
      } else {
        val.isLike = false;
      }
    });
  } else {
    projects?.forEach((val) => {
      val.isLike = false;
    });
  }
  const project = await Project.findOne({
    user: userId,
    isDeleted: false,
    "images.image": { $exists: true },
  }).lean();

  if (project) {
    if (project.images) {
      designer.images = project.images;
    } else {
      designer.images = [];
    }
  } else {
    designer.images = [];
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
    //isVerify: true,
    // isApproved:true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const checkUser = await User.findOne({ _id: userId, isDeleted: false });
  if (!JSON.stringify(checkUser?.saveProfiles).includes(designerId)) {
    const designer = await User.findOneAndUpdate(
      {
        _id: userId,
        //isVerify: true,
        // isApproved:true,
        isDeleted: false,
      },
      { $push: { saveProfiles: designerId } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: designerId, isDeleted: false },
      { $inc: { numberOfSaveProfiles: 1 } }
    );

    return { isSaveProfile: true };
  } else {
    const designer = await User.findOneAndUpdate(
      {
        _id: userId,
        //isVerify: true,
        // isApproved:true,
        isDeleted: false,
      },
      { $pull: { saveProfiles: designerId } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: designerId, isDeleted: false },
      { $inc: { numberOfSaveProfiles: -1 } }
    );

    return { isSaveProfile: false };
  }
};
export const getSlots = async (
  designerId,
  date,
  userId,
  timeDuration,
  timeZone
) => {
  const check = await User.findOne({
    _id: designerId,
    isDeleted: false,
    // isVerify: true,
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
  let countCheck = 0;
  const consultations = await Consultations.find({
    designer: designerId,
    isDeleted: false,
    isConfirm: true,
    isPast: false,
  })
    .distinct("confirmSlotTime")
    .lean();

  const dates = [];
  let originalDate = new Date(date);
  originalDate.setMinutes(originalDate.getMinutes() + 1);
  let nextDate = originalDate.toISOString();
  //  var nextDate = date;
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
        if (countCheck !== 0) {
          var d = nextDate;
          d.setDate(nextDate.getDate() + 1);
          dates.push({
            date: moment(new Date(d)),
            startTime: val.startTime,
            endTime: val.endTime,
          });
        } else {
          dates.push({
            date: moment(new Date(nextDate)),
            startTime: val.startTime,
            endTime: val.endTime,
          });
        }
        nextDate.setHours(0, 0, 0, 0);
        nextDate.setDate(nextDate.getDate()); // +1 add
        nextDate = new Date(nextDate);
        moment(nextDate).format("dddd");
        //console.log(nextDate,"nnnnnnnnnnnnnnn",moment(nextDate).format("dddd"))
        testDay = moment(nextDate).format("dddd");
        countCheck = countCheck + 1;
        count = count + 1;
        checkKey = true;
        console.log(nextDate);
      }
    }
    console.log(checkKey);
    if (checkKey == false) {
      countCheck = countCheck + 1;
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
    const timeSlots = await Promise.all(
      slots.filter((date) => !data.includes(date))
    );

    const data1 = timeSlots?.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      //console.log(new Date(slots));
      return new Date(slots);
    });
    return data1;
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
    const data1 = result?.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      //console.log(new Date(slots),"ggiigig");
      return new Date(slots);
    });
    return data1;
  }
};
export const getSlotDates = async (designerId, timeZone) => {
  const check = await User.findOne({
    _id: designerId,
    isDeleted: false,
    //isVerify: true,
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
  console.log(check.weeklySchedule);

  const consultations = await Consultations.find({
    designer: designerId,
    isDeleted: false,
    isConfirm: true,
    isPast: false,
  })
    .distinct("confirmSlotTime")
    .lean();

  const dates = [];
  let originalDate = new Date();
  console.log(originalDate, "originambbcbbnjkkbjb");
  originalDate = momentTz
    .tz(originalDate, timeZone)
    .format("YYYY-MM-DDTHH:mm:ss");
  originalDate = new Date(originalDate);
  console.log(originalDate, "tztztztztzttztztztzz");
  originalDate.setMinutes(originalDate.getMinutes() + 1);
  let nextDate = originalDate.toISOString();
  //var nextDate = date;
  nextDate = new Date(nextDate);
  var testDay;
  testDay = moment(nextDate).format("dddd");
  let countCheck = 0;
  for (let count = 0; count < 30; ) {
    let checkKey = false;
    if (count == 1) {
      nextDate.setHours(0, 0, 0, 0);
      nextDate.setDate(nextDate.getDate());
      testDay = moment(nextDate).format("dddd");
    }
    for (const val of check.weeklySchedule) {
      if (val.status && val.day == testDay && count < 30) {
        if (countCheck !== 0) {
          var d = nextDate;
          d.setDate(nextDate.getDate() + 1);
          dates.push({
            date: moment(new Date(d)),
            startTime: val.startTime,
            endTime: val.endTime,
          });
        } else {
          dates.push({
            date: moment(new Date(nextDate)),
            startTime: val.startTime,
            endTime: val.endTime,
          });
        }
        nextDate.setHours(0, 0, 0, 0);
        nextDate.setDate(nextDate.getDate()); //+1
        nextDate = new Date(nextDate);
        moment(nextDate).format("dddd");
        //console.log(nextDate,"nnnnnnnnnnnnnnn",moment(nextDate).format("dddd"))
        testDay = moment(nextDate).format("dddd");

        count = count + 1;
        checkKey = true;
        countCheck = countCheck + 1;
        console.log(nextDate);
      }
    }
    console.log(checkKey);
    countCheck = countCheck + 1;
    if (checkKey == false) {
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      testDay = moment(nextDate).format("dddd");
      //  console.log(nextDate, "nnnnnnnnnnnnnnn");
      nextDate = new Date(nextDate);
    }
  }
  //console.log(dates);
  dates.shift();
  return dates;
};
export const getSaveProfiles = async (data, userId) => {
  const check = await User.findOne(
    {
      _id: userId,
      // isVerify: true,
      // isApproved:true,
      isDeleted: false,
    },
    { saveProfiles: { $slice: [data.page * data.limit, data.limit] } }
  ).populate({
    path: "saveProfiles",
    select: [
      "email",
      "name",
      "isBlocked",
      "companyName",
      "address",
      "instagramLink",
      "pinterestLink",
      "about",
      "projectType",
      "virtual_Consultations",
      "newClientProjects",
      "destinationProject",
      "feeStructure",
      "tradeDiscount",
      "minBudget",
      "maxBudget",
      "weeklySchedule",
      "availability",
      "goals",
      "preferences",
      "projectSize",
      "styles",
    ],
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  return check?.saveProfiles;
};
export const bookConsultations = async (
  designerId,
  timeSlots,
  projectSummary,
  userId,
  files,
  durationTime,
  timeZone
) => {
  const check = await User.findOne({
    _id: designerId,
    // isVerify: true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  // const slots = timeSlots?.map((slot) => {
  //   const originalDate = new Date(slot);
  //   console.log(originalDate.toISOString());
  //   return originalDate.toISOString();
  // });
  // const slots = timeSlots?.map((slot) => {
  //   return moment.tz(slot, timeZone).utc().toDate();
  // });
  // console.log(slots);
  const data = await Consultations.create({
    designer: designerId,
    timeSlots: timeSlots,
    projectSummary: projectSummary,
    user: userId,
    files: files,
    durationTime: durationTime,
  });

  // const slot = data?.timeSlots.map((val) => {
  //   return momentTz.tz(val, timeZone).format("YYYY-MM-DDTHH:mm:ss");
  // });
  // delete data.timeSlots;
  // data.timeSlots = slot;
  //clg

  return data;
};
export const getConsultations = async (page, limit, clientId, timeZone) => {
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
        select: ["_id", "email", "name", "companyName"],
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
        select: ["_id", "email", "name", "companyName"],
      }),
  ]);
  UpcomingConsultation?.forEach((val) => {
    const newvalue = val.timeSlots.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      console.log(new Date(slots));
      return new Date(slots);
    });
    const confirmTime = val?.confirmSlotTime;
    delete val.timeSlots,
      delete val?.confirmSlotTime,
      (val.timeSlots = newvalue);
    if (confirmTime) {
      val.confirmSlotTime = momentTz
        .tz(confirmTime, timeZone)
        .format("YYYY-MM-DDTHH:mm:ss");
    }
  });
  pastConsultations?.forEach((val) => {
    const newvalue = val.timeSlots.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      console.log(new Date(slots));
      return new Date(slots);
    });
    const confirmTime = val?.confirmSlotTime;
    delete val.timeSlots,
      delete val?.confirmSlotTime,
      (val.timeSlots = newvalue);
    if (confirmTime) {
      val.confirmSlotTime = momentTz
        .tz(confirmTime, timeZone)
        .format("YYYY-MM-DDTHH:mm:ss");
    }
  });
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
export const addFileConsultation = async (consultationId, file, fileType) => {
  console.log(consultationId);
  const check = await Consultations.findOne({
    _id: consultationId,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONSULTATION_NOT_EXIST
    );
  }
  const consultation = await Consultations.findOneAndUpdate(
    {
      _id: consultationId,
      isDeleted: false,
    },
    { $push: { files: { file: file, fileType: fileType } } },
    { new: true }
  );
  return consultation;
};
export const createProjectInquery = async (body, userId) => {
  body.user = userId;
  body.isVerify = true;
  const project = await ProjectInquery.create(body);
  return project;
};
export const deleteProjectInquery = async (projectId) => {
  const check = await ProjectInquery.findOne({
    _id: projectId,
    //  isVerify: true,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }
  const project = await ProjectInquery.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  const data = await projectRequest.updateMany(
    {
      projectId: projectId,
      isDeleted: false,
    },
    { isDeleted: true }
  );
  return project;
};
export const deleteProjectInqueryImage = async (Id, projectId) => {
  const data = await ProjectInquery.findOneAndUpdate(
    { _id: projectId },
    {
      $pull: {
        files: { _id: Id },
      },
    },
    { new: true }
  );
  console.log(data);
  return data;
};
export const getInqueryStatus = async (projectId) => {
  const project = await projectRequest
    .find({
      projectId: projectId,
      isDeleted: false,
    })
    .populate({
      path: "designer",
      select: ["name", "email", "_id", "companyName"],
    })
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
    //  isVerify: true,
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
    // isVerify: true,
  });
  // const project = data.toObject();
  // await formatProjectInquery(project);

  return data;
};
export const getProjectInqueries = async (page, limit, userId) => {
  const projects = await ProjectInquery.find({ user: userId, isDeleted: false })
    .lean()
    .skip(page * limit)
    .limit(limit)
    .sort({ _id: -1 });
  await formatProjectInquery(projects);

  return projects;
};
export const getProjects = async (userId) => {
  const projects = await ProjectInquery.find({
    user: userId,
    isDeleted: false,
  }).lean();
  await formatProjects(projects);

  return projects;
};
export const editProjectInquery = async (body, userId) => {
  const projectId = body.projectId;
  body.user = userId;
  delete body.projectId;
  const val = body.kindOfAssistance;
  delete body.kindOfAssistance;
  body.$set = { kindOfAssistance: val };
  console.log(body);
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
export const saveImages = async (data, userId) => {
  const project = await Project.findOne({
    _id: data.projectId,
    isDeleted: false,
  });
  if (!project) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }

  const check = await User.findOne({ _id: userId, isDeleted: false });
  if (!JSON.stringify(check.saveImages).includes(data.projectId)) {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false, //isVerify: true
      },
      {
        $push: { saveImages: { image: data.image, projectId: data.projectId } },
      },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: project.user, isDeleted: false },
      {
        $inc: { numberOfSaveImage: 1 },
      }
    );
    return { isSave: true };
  } else {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false, //isVerify: true
      },
      {
        $pull: { saveImages: { image: data.image, projectId: data.projectId } },
      },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: project.user, isDeleted: false },
      {
        $inc: { numberOfSaveImage: -1 },
      }
    );
    return { isSave: false };
  }
};
export const getSaveImages = async (page, limit, userId) => {
  const user = await User.findOne(
    { _id: userId, isDeleted: false },
    { saveImages: { $slice: [page * limit, limit] } }
  )
    .populate("saveImages.projectId")
    .lean();
  user?.saveImages.forEach((val) => {
    val.isLike = true;
  });
  return user?.saveImages;
};
export const review = async (data, userId) => {
  const check = await User.findOne({
    _id: data.designerId,
    isDeleted: false,
    //isVerify: true,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.DESIGNER_NOT_FOUND
    );
  }
  const reviews = await Review.create({
    user: userId,
    designer: data.designerId,
    reviewText: data.reviewText,
    rating: data.rating,
  });
  return reviews;
};
export const cancelBooking = async (body, userId) => {
  const check = await Consultations.findOne({
    _id: body.consultationId,
    isDeleted: false,
    //isConfirm: false,
    //isCancel: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONSULTATION_NOT_EXIST
    );
  }
  if (check.isCancel) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ALREADY_CANCEL
    );
  }

  const date = new Date();
  const timeDifferenceInMilliseconds = Math.abs(date - check.createdAt);
  const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);
  const time = parseInt(timeDifferenceInHours.toFixed());

  if (time <= 72) {
    const order = await Payment.findOne({
      consultationId: body.consultationId,
      isDeleted: false,
    });
    if (order) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: order?.transitionId,
        });
      } catch (error) {
        return error.message;
      }

      await Payment.findOneAndUpdate(
        {
          consultationId: body.consultationId,
          isDeleted: false,
        },
        {
          isRefund: true,
        }
      );
    }
  }
  const data = await Consultations.findOneAndUpdate(
    {
      _id: body.consultationId,
      isDeleted: false,
      //isConfirm: false,
      // isCancel: false,
    },
    {
      isCancel: true,
      reason: body.reason,
      canceledBy: userId,
    },
    {
      new: true,
    }
  );
  const user = await User.findOne({ _id: userId, isDeleted: false }).lean();
  sendEmail.cancelBooking(
    body.consultationId,
    user?.name,
    body.reason,
    user?.email
  );
  return data;
};
export const rescheduledBookConsultations = async (body, userId) => {
  const check = await Consultations.findOne({
    _id: body.consultationId,
    isDeleted: false,
    //isConfirm: true,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONSULTATION_NOT_EXIST
    );
  }
  const consultationId = body.consultationId;
  delete body.consultationId;
  delete body.isConfirm;
  body.isConfirm = false;
  body.isReschedule = true;
  const user = await User.findOne({ _id: userId, isDeleted: false });
  console.log(user);
  const update = await Consultations.findOneAndUpdate(
    {
      _id: consultationId,
      isDeleted: false,
      //isConfirm: true,
    },
    body,
    {
      new: true,
    }
  );
  sendEmail.rescheduledBookConsultationsBookingClient(
    consultationId,
    user?.name,
    user?.email
  );
  return update;
};
