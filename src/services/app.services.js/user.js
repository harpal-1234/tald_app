import { User } from "../../models/index.js";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
  OPTIONS,
  PROJECT_TYPE,
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
  maximumPrice
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
  console.log(minimumPrice);
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
          minBudget: minimumPrice ? { $gte: minimumPrice } : { $lte: "0" },
          maxBudget: maximumPrice
            ? { $lte: maximumPrice }
            : { $lte: "100000000000000000000000000" },
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
    }).lean();
    await formatUser(designer);
    return designer;
  }

  const designer = await User.find({
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
        minBudget: minimumPrice ? { $gte: minimumPrice } : { $lte: "0" },
        maxBudget: maximumPrice
          ? { $lte: maximumPrice }
          : { $lte: "100000000000000000000000000" },
      },
    ],
  }).lean();
  await formatUser(designer);
  return designer;
};
