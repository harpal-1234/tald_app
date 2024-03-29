import {
  User,
  Project,
  Consultations,
  ProjectInquery,
  Conversation,
  projectRequest,
  Payment,
  Filter,
} from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import moment from "moment";
import momentTz from "moment-timezone";
import {
  formatUser,
  formatProjectInquery,
} from "../../utils/commonFunction.js";
import * as zoomMeeting from "../../utils/zoomMeeting.js";
import * as sendEmail from "../../utils/sendMail.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51NuIYPKs8Y4Y2av4NWgrHFmq8R42IrEiIZ4c8jAsc23JsPqeq60bX7uKZZGb24dujnaheL7J6WsisNUtrJof0wlq00jvt0higK"
);
export const createProject = async (userId, projectName) => {
  const check = await Project.findOne({
    projectName: projectName,
    user: userId,
    isDeleted: false,
  });
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT
    );
  }
  const project = await Project.create({
    projectName: projectName,
    user: userId,
  });
  return project;
};
export const seeProject = async (userId) => {
  const project = await Project.find({
    user: userId,
    isDeleted: false,
  });

  return project;
};
export const addImages = async (userId, projectId, images) => {
  const check = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }
  var project;
  await Promise.all(
    images.map(async (image) => {
      project = await Project.findOneAndUpdate(
        {
          _id: projectId,
          isDeleted: false,
        },
        { $push: { images: { image: image.image } } },
        {
          new: true,
        }
      );
    })
  );

  return project;
};
export const Portfolio = async (userId) => {
  const data = await Project.find({ user: userId, isDeleted: false }).sort({
    _id: -1,
  });
  return data;
};
export const deleteProject = async (userId, projectId) => {
  const data = await Project.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  return data;
};
export const deleteProjectImages = async (imageIds, projectId, userId) => {
  var data;

  for (let id of imageIds) {
    data = await Project.findOneAndUpdate(
      { _id: projectId, user: userId, isDeleted: false },
      { $pull: { images: { _id: id } } },
      { new: true }
    );
  }

  return data;
};
export const addAvailability = async (
  weeklySchedule,
  availability,
  isIndefinitely,
  inviteesSchedule,
  userId
) => {
  const check = await User.findOne({ _id: userId, isDeleted: false }).lean();
  if (check?.subscription?.expireDate < currentDate || !check.subscription) {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isSubscription: false }
    );
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.UPGRATE
    );
  }

  var currentDate = availability.startDate
    ? new Date(availability.startDate)
    : new Date();

  const next40thDay = new Date(
    currentDate.getTime() + availability.numberOfDays * 24 * 60 * 60 * 1000
  );
  if (isIndefinitely == true) {
    const date = new Date();
    const next30YearsDate = new Date();
    next30YearsDate.setFullYear(next30YearsDate.getFullYear() + 30);
    const data1 = await User.findOneAndUpdate(
      { _id: userId },
      {
        availability: {
          startDate: moment(date).format("YYYY-MM-DD"),
          endDate: moment(next30YearsDate).format("YYYY-MM-DD"),
        },
        isIndefinitely: true,
        weeklySchedule: weeklySchedule,
        inviteesSchedule: inviteesSchedule,
      },
      { new: true }
    );
    const data = data1.toObject();
    await formatUser(data);
    return data;
  } else {
    const data1 = await User.findOneAndUpdate(
      { _id: userId },
      {
        availability: {
          startDate: currentDate,
          endDate: moment(next40thDay).format("YYYY-MM-DD"),
        },
        weeklySchedule: weeklySchedule,
        isIndefinitely: false,
        inviteesSchedule: inviteesSchedule,
      },
      { new: true }
    );
    const data = data1.toObject();
    await formatUser(data);
    return data;
  }
};
export const getAvailability = async (userId) => {
  const availability = await User.findOne({
    _id: userId,
    isDeleted: false,
  }).lean();
  const startDate = new Date(availability.availability?.startDate);
  const endDate = new Date(availability.availability?.endDate);
  const timeDifference = endDate - startDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  if (availability.availability) {
    availability.availability.numberOfDays = daysDifference;
  }
  const data = {
    availability: availability.availability,
    weeklySchedule: availability.weeklySchedule,
    isIndefinitely: availability.isIndefinitely,
    inviteesSchedule: availability.inviteesSchedule,
  };
  return data;
};
export const editProjectDetails = async (data, userId) => {
  const value = await User.findOneAndUpdate(
    {
      _id: userId,
      //isVerify: true,
      isDeleted: false,
    },
    {
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
    },
    { new: true }
  );
  return value;
};
export const editCompanyDetails = async (data, userId) => {
  const value = await User.findOneAndUpdate(
    {
      _id: userId,
      // isVerify: true,
      isDeleted: false,
    },
    {
      companyName: data.companyName,
      location: {
        type: "Point",
        coordinates: [data.long, data.lat],
      },
      address: data.address,
      instagramLink: data.instagramLink,
      pinterestLink: data.pinterestLink,
      about: data.about,
    },
    { new: true }
  );
  return value;
};
export const editFeeStructure = async (data, userId) => {
  const project = await User.findOneAndUpdate(
    {
      _id: userId,
      isDeleted: false,
      // isVerify: true,
    },
    {
      feeStructure: data.feeStructure,
      tradeDiscount: data.tradeDiscount,
    },
    { new: true }
  );
  return project;
};
export const editVendorProfile = async (data, userId) => {
  const profile = await User.findOneAndUpdate(
    {
      _id: userId,
      isDeleted: false,
      //isVerify: true,
    },
    {
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
      companyName: data.companyName,
      // $set: {
      //   location: {
      //     type: "Point",
      //     coordinates: [data.long, data.lat],
      //   },
      // },
      address: data.address,
      instagramLink: data.instagramLink,
      pinterestLink: data.pinterestLink,
      about: data.about,
      feeStructure: data.feeStructure,
      tradeDiscount: data.tradeDiscount,
      preferences: data.preferences,
      projectSize: data.projectSize,
      styles: data.styles,
      goals: data.goals,
      needHelp: data.needHelp,
      fullServiceClients: data.fullServiceClients,
    },
    { new: true }
  );
  return profile;
};
export const getConsultations = async (page, limit, designerId, timeZone) => {
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
  const [requestedConsultations, confirmedConsultations, pastConsultations] =
    await Promise.all([
      Consultations.find({
        designer: designerId,
        isDeleted: false,
        isConfirm: false,
        isPast: false,
        isCancel: false,
        isPayment: true,
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ _id: -1 })
        .lean()
        .populate({
          path: "user",
          select: ["_id", "email", "name"],
        }),
      Consultations.find({
        designer: designerId,
        isDeleted: false,
        isConfirm: true,
        isCancel: false,
        isPast: false,
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ _id: -1 })
        .lean()
        .populate({
          path: "user",
          select: ["_id", "email", "name"],
        }),
      Consultations.find({
        designer: designerId,
        isDeleted: false,
        isPast: true,
        isCancel: false,
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ _id: -1 })
        .lean()
        .populate({
          path: "user",
          select: ["_id", "email", "name"],
        }),
    ]);
  confirmedConsultations?.forEach((val) => {
    const newvalue = val.timeSlots.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      // console.log(new Date(slots));
      return slots;
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
  requestedConsultations?.forEach((val) => {
    const newvalue = val.timeSlots.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      // console.log(new Date(slots));
      return slots;
    });
    delete val.timeSlots,
      delete val?.confirmSlotTime,
      (val.timeSlots = newvalue);
  });
  pastConsultations?.forEach((val) => {
    const newvalue = val.timeSlots.map((slots) => {
      slots = momentTz.tz(slots, timeZone).format("YYYY-MM-DDTHH:mm:ss");
      // console.log(new Date(slots));
      return slots;
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
      type: "requestedConsultations",
      value: requestedConsultations,
    },
    {
      type: "confirmedConsultations",
      value: confirmedConsultations,
    },
    {
      type: "pastConsultations",
      value: pastConsultations,
    },
  ];
  return consultations;
};
export const consultationAction = async (
  consultationId,
  confirmTime,
  designerId,
  timeZone
) => {
  const check = await Consultations.findOne({
    _id: consultationId,
    isDeleted: false,
    designer: designerId,
    isConfirm: false,
    isPast: false,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.CONSULTATION_NOT_EXIST
    );
  }
  const date = moment(new Date()).format();
  if (date > confirmTime) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.VALID_DATE
    );
  }
  const designer = await User.findOne({
    _id: designerId,
    // isVerify: true,
    isDeleted: false,
  });
  const zoomLink = await zoomMeeting.createZommLink(
    designer.email,
    check.durationTime == "25_mins" ? 30 : 60
  );
  const data = await Consultations.findOneAndUpdate(
    {
      _id: consultationId,
      isDeleted: false,
      designer: designerId,
      isConfirm: false,
      isPast: false,
    },
    {
      confirmSlotTime: moment
        .tz(confirmTime, timeZone)
        .utc()
        .toDate()
        .toISOString(),
      isConfirm: true,
      zoomMeetingLink: zoomLink,
    },
    { new: true }
  );
  const user = await User.findOne({ _id: check.user, isDeleted: false });
  sendEmail.acceptBooking(
    consultationId,
    designer?.name,
    //body.reason,
    user?.email
  );
  return data;
};
export const getProjectInqueries = async (page, limit, designerId) => {
  const projects = await projectRequest
    .find({
      designer: designerId,
      isVerify: true,
      isDeleted: false,
    })
    .skip(page * limit)
    .sort({ _id: -1 })
    .limit(limit)
    .lean()
    .populate([
      {
        path: "user",
        select: ["email", "userName"],
      },
      { path: "projectId" },
    ]);
  projects?.forEach((val) => {
    (val.project = val.projectId), delete val.projectId;
  });

  formatProjectInquery(projects);
  return projects;
};
export const actionProjectInquery = async (Id, status, designerId) => {
  const check = await projectRequest.findOne({
    _id: Id,
    designer: designerId,
    isDeleted: false,
    // isVerify: true,
  });
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PROJECT_NOT_FOUND
    );
  }

  const project = await projectRequest.findOneAndUpdate(
    {
      _id: Id,
      designer: designerId,
      isDeleted: false,
      // isVerify: true,
    },
    {
      status: status,
    },
    { new: true }
  );

  const conversation = await Conversation.findOne({
    $or: [
      { sender: project.user, receiver: designerId },
      { sender: designerId, receiver: project.user },
    ],
  });
  if (!conversation) {
    const time = new Date();
    await Conversation.create({
      sender: designerId,
      receiver: check.user,
      message: "",
      messageType: "",
      messageTime: time,
    });
  }

  return project;
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
  const user = await User.findOne({ _id: userId, isDeleted: true });
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
  // delete body.consultationId;
  // delete body.isConfirm;
  // body.isConfirm = false;
  // body.isReschedule = true;
  const designer = await User.findOne({ _id: userId, isDeleted: false });
  const user = await User.findOne({ _id: check.user, isDeleted: false });
  // console.log(user);
  // const update = await Consultations.findOneAndUpdate(
  //   {
  //     _id: consultationId,
  //     isDeleted: false,
  //     //isConfirm: true,
  //   },
  //   body,
  //   {
  //     new: true,
  //   }
  // );
  console.log(user.email);
  const link = `https://client.tald.co/consultations?reschedule=${consultationId}`;
  sendEmail.rescheduledBookConsultationsBookingDesigner(
    consultationId,
    designer?.name,
    user?.email,
    link
  );
  return;
};
export const checkConsultationStatus = async () => {
  const check = await Consultations.find({
    isDeleted: false,
    isConfirm: false,
    isCancel: false,
    isPast: false,
  });
  for (const value of check) {
    const date = new Date();
    const timeDifferenceInMilliseconds = Math.abs(date - value.createdAt);
    const timeDifferenceInHours =
      timeDifferenceInMilliseconds / (1000 * 60 * 60);
    const time = parseInt(timeDifferenceInHours.toFixed());
    if (time > 72) {
      const order = await Payment.findOne({
        consultationId: value.consultationId,
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
            consultationId: value.consultationId,
            isDeleted: false,
          },
          {
            isRefund: true,
          }
        );
        const data = await Consultations.findOneAndUpdate(
          {
            _id: value.consultationId,
            isDeleted: false,
            //isConfirm: false,
            // isCancel: false,
          },
          {
            isCancel: true,
            // reason: body.reason,
            //canceledBy: userId,
          },
          {
            new: true,
          }
        );
      }
    }
  }
};
