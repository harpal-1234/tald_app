import mongoose from "mongoose";
import {
  PROJECT_TYPE,
  OPTIONS,
  STATUS,
  KIND_OF_ASSITANCE,
} from "../config/appConstants.js";

const filterSchema = mongoose.Schema(
  {
    style:[{type:String}],
    preferences:[{type:String}],
    projectSize:[{type:String}],
    needHelp:[{type:String}],
    feeStructure:[{type:String}],
    goals:[{type:String}],
    isDeleted:{type:Boolean,default:false}
  },

  {
    timestamps: true,
  }
);
const Filter = mongoose.model("filter", filterSchema);

export { Filter };
