import { User, Project, Consultations } from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import moment from "moment";
import axios from "axios";
import { formatUser } from "../../utils/commonFunction.js";
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
  const data = await Project.find({ user: userId, isDeleted: false });
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
  const currentDate = new Date(availability.startDate);

  const next40thDay = new Date(
    currentDate.getTime() + availability.numberOfDays * 24 * 60 * 60 * 1000
  );
  if (isIndefinitely == true) {
    const data1 = await User.findOneAndUpdate(
      { _id: userId },
      {
        availability: {
          startDate: "",
          endDate: "",
        },
        isIndefinitely: true,
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
          startDate: moment(
            availability.startDate + "Z",
            "YYYY-MM-DD" + "Z"
          ).toDate(),
          endDate: next40thDay,
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
  const availability = await User.findOne({ _id: userId, isDeleted: false });
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
      isVerify: true,
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
      isVerify: true,
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
      isVerify: true,
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
      isVerify: true,
    },
    {
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
      companyName: data.companyName,
      location: {
        type: "Point",
        coordinates: [data.long, data.lat],
      },
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
    },
    { new: true }
  );
  return profile;
};
export const getConsultations = async (page, limit, designerId) => {
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
  designerId
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
  const data = await Consultations.findOneAndUpdate(
    {
      _id: consultationId,
      isDeleted: false,
      designer: designerId,
      isConfirm: false,
      isPast: false,
    },
    {
      confirmSlotTime: confirmTime,
      isConfirm: true,
    },
    { new: true }
  );
  return data;
};
export const zoom = async () => {
  const redirect_uri = "https:api.tald.co/vendor/app/callBack";
  const clientId = "GuiPmdbXTwGFQRXnCvatKA";
  const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
  return authUrl;
};
export const callBack = async (code) => {
  // const code = "req.query.code";

  const tokenUrl = "https://zoom.us/oauth/token";

  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: "https:loalhost:5050/vendor/app/callBack",
  };
  const clientId = "GuiPmdbXTwGFQRXnCvatKA";
  const clientSeceret = "s3UXkPfleU3jft1F2bC3UCLedtFqvaEn";
  const authHeader = `Basic ${Buffer.from(
    `${clientId}:${clientSeceret}`
  ).toString("base64")}`;

  const config = {
    headers: {
      Authorization: authHeader,
    },
  };

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams(data),
      config
    );

    const accessToken = response.data.access_token;

    // You now have the access token for making authenticated requests to Zoom APIs

    // Create a Zoom meeting using the access token
    const createMeetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const joinUrl = createMeetingResponse.data.join_url;
    console.log(`Zoom meeting link: ${joinUrl}`);

    res.send(
      `Zoom meeting link: <a href="${joinUrl}" target="_blank">${joinUrl}</a>`
    );
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    //    res.send("Error creating Zoom meeting");
  }
};
