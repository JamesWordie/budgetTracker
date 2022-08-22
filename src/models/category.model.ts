// External
import { Schema, model, Types } from "mongoose";
// Config
import { ICategory } from "../interfaces/exports.interfaces";

/**
 * @class ExpenseSchema
 * setup of the expense model
 */
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      unique: true,
      trim: true,
      minLength: 2,
    },
    description: {
      type: String,
      required: [true, "Please provide a category description"],
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = model<ICategory>("Category", CategorySchema);

export default Category;
