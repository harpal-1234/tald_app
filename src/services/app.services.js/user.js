import { User, Project } from "../../models/index.js";
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
        ? { $in: preferences }
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
      goals: goals ? { $in: goals } : { $in: [...Object.values(GOALS)] },
      styles: styles ? { $in: styles } : { $in: [...Object.values(STYLE)] },
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
        ? { $in: preferences }
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
      goals: goals ? { $in: goals } : { $in: [...Object.values(GOALS)] },
      styles: styles ? { $in: styles } : { $in: [...Object.values(STYLE)] },
    });
    // await formatUser(designer);
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
      ? { $in: preferences }
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
    goals: goals ? { $in: goals } : { $in: [...Object.values(GOALS)] },
    styles: styles ? { $in: styles } : { $in: [...Object.values(STYLE)] },
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
      ? { $in: preferences }
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
    goals: goals ? { $in: goals } : { $in: [...Object.values(GOALS)] },
    styles: styles ? { $in: styles } : { $in: [...Object.values(STYLE)] },
  });
  // await formatUser(designer);
  return { designer, total };
};
export const getInteriorDesignerById = async (designerId, page, limit) => {
  const designer = await User.findOne({
    _id: designerId,
    isVerify: true,
    // isApproved:true,
    isDeleted: false,
  });

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
