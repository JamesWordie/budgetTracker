// External
import { FilterQuery, Types } from "mongoose";
import { get } from "lodash";
// Config
import { BadRequestError } from "../errors";
import { IExpense } from "../interfaces/IExpense";
import Expense from "../models/expense.model";
import { checkUser } from "./user.services";
// Utilities
import log from "../logger";

/**
 * @function findAllExpenses
 * @param query partial IExpense with the query params
 * @returns an array of IExpense objects
 */
const findAllExpenses = async (query: FilterQuery<IExpense>) => {
  try {
    return Expense.find(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error.message);
  }
};

/**
 * @function findAnExpense
 * @param query partial IExpense with the query params
 * @returns a single IExpense object
 */
const findAnExpense = async (query: FilterQuery<IExpense>) => {
  try {
    return Expense.findOne(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(
      `Something went wrong trying to find the expense with Id: ${query._id}`
    );
  }
};

/**
 * @function createAnExpense
 * @param userId from the request headers
 * @param input an IExpense object
 * @returns the newly created IExpense object
 */
const createExpense = async (userId: Types.ObjectId, input: IExpense) => {
  const createdBy = get(input, "createdBy");

  createdBy && checkUser(userId, createdBy);

  try {
    return await Expense.create(input);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

/**
 * @function updateExpense
 * @param expenseId from request params - mongoose ID of resource
 * @param userId from the request headers
 * @param update updated fields for the IExpense, Partial IExpense
 * @returns the updated IExpense object
 */
const updateExpense = async (
  expenseId: string,
  userId: string | Types.ObjectId,
  update: Partial<IExpense>
) => {
  const createdBy = get(update, "createdBy");

  createdBy && checkUser(userId, createdBy);

  try {
    return await Expense.findByIdAndUpdate(expenseId, update);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

/**
 * @function deleteExpense
 * @param expenseId from request params - mongoose ID of resource
 * @returns resource or BadRequestError
 */
const deleteExpense = async (expenseId: string | Pick<IExpense, "_id">) => {
  try {
    return await Expense.findByIdAndDelete(expenseId);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

export {
  findAllExpenses,
  findAnExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
