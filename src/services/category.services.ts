// External
import { FilterQuery, Types } from "mongoose";
import { get } from "lodash";
// Config
import { BadRequestError, DuplicateResourceError } from "../errors";
import Category from "../models/category.model";
import { ICategory } from "../interfaces/ICategory";
import { checkUser } from "./user.services";
// Utilities
import log from "../logger";

/**
 * @function findAllCategories
 * @returns an array of ICategory objects
 */
const findAllCategories = async () => {
  try {
    return Category.find();
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error.message);
  }
};

/**
 * @function createCategory
 * @param userId from the request headers
 * @param input an ICategory object
 * @returns the newly created ICategory object
 */
const createCategory = async (userId: Types.ObjectId, input: ICategory) => {
  const createdBy = get(input, "createdBy");

  createdBy && checkUser(userId, createdBy);

  try {
    return await Category.create(input);
  } catch (error: any) {
    // Duplicate Error
    isDuplicateError(error);
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

/**
 * @function findACategory
 * @param query partial ICategory with the query params
 * @returns a single ICategory object
 */
const findACategory = async (query: FilterQuery<ICategory>) => {
  try {
    return Category.findOne(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(
      `Something went wrong trying to find the category with Id: ${query._id}`
    );
  }
};

/**
 * @function updateCategory
 * @param categoryId from request params - mongoose ID of resource
 * @param userId from the request headers
 * @param update updated fields for the ICategory, Partial ICategory
 * @returns the updated ICategory object
 */
const updateCategory = async (
  categoryId: string,
  userId: string | Types.ObjectId,
  update: Partial<ICategory>
) => {
  const createdBy = get(update, "createdBy");

  createdBy && checkUser(userId, createdBy);

  try {
    return await Category.findByIdAndUpdate(categoryId, update);
  } catch (error: any) {
    // Duplicate Error
    isDuplicateError(error);
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

const isDuplicateError = (error: any) => {
  if (error?.code === 11000) {
    throw new DuplicateResourceError(
      `Duplicate value entered for the ${Object.keys(
        error.keyValue
      )} field, ${Object.values(
        error.keyValue
      )} is already in use, please choose another.`
    );
  }
};

/**
 * @function deleteCategory
 * @param categoryId from request params - mongoose ID of resource
 * @returns resource or BadRequestError
 */
const deleteCategory = async (categoryId: string | Pick<ICategory, "_id">) => {
  try {
    return await Category.findByIdAndDelete(categoryId);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

export {
  findAllCategories,
  findACategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
