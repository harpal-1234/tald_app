import { successResponse } from "../../utils/response.js";
import { User, Project } from "../../models/index.js";
import { catchAsync } from "../../utils/universalFunction.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import config from "../../config/config.js";
import bcrypt from "bcryptjs";
import joi from "joi";
import notificationServices from "../../utils/notification.js";
import { getPortfolio } from "../../controllers/app/vendor.js";
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
  // console.log(currentDate)
  const next40thDay = new Date(
    currentDate.getTime() + availability.numberOfDays * 24 * 60 * 60 * 1000
  );
  console.log(next40thDay, "gjguuhouhohoihoihoo");
  const data = await User.findOneAndUpdate({_id:userId},{
    availability: {
      startDate: moment(
        availability.startDate + "Z",
        "YYYY-MM-DD" + "Z"
      ).toDate(),
      endDate: moment(next40thDay + "Z", "YYYY-MM-DD" + "Z").toDate(),
    },
  });
  console.log(data);
};
