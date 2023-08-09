import { User, Project } from "../../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import moment from "moment";

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
    const data = await User.findOneAndUpdate(
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
    return data;
  } else {
    const data = await User.findOneAndUpdate(
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
