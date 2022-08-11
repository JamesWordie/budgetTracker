import { get } from "lodash";
import { FilterQuery, Types } from "mongoose";
import { BadRequestError } from "../errors";
import { IExpense } from "../interfaces/IExpense";
import { IUser } from "../interfaces/IUser";
import log from "../logger";
import Expense from "../models/expense.model";

const findAllExpenses = async (query: FilterQuery<IExpense>) => {
  try {
    return Expense.find(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error.message);
  }
};

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

const createExpense = async (userId: Types.ObjectId, input: IExpense) => {
  const createdBy = get(input, "createdBy");

  if (createdBy !== userId)
    throw new BadRequestError(
      "UserId of session does not match that on the request."
    );

  try {
    return await Expense.create(input);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

const updateExpense = async (
  expenseId: string,
  userId: string | Types.ObjectId,
  update: Partial<IExpense>
) => {
  const createdBy = get(update, "createdBy");

  if (createdBy !== userId)
    throw new BadRequestError(
      "UserId of session does not match that on the request."
    );

  try {
    return await Expense.findByIdAndUpdate(expenseId, update);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error?.message);
  }
};

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
