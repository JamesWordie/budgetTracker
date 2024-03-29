// External
import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { get } from "lodash";
// Config
import {
  findAllExpenses,
  findAnExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  formatExpenseQuery,
} from "../services/expense.services";
import log from "../logger";
import { ICategory, IExpenseSearch } from "../interfaces/exports.interfaces";
import { BadRequestError } from "../errors";
import { findAllCategories } from "../services/category.services";

/**
 * @function getAllExpenses
 * @returns all expenses for a specific user
 */
const getAllExpenses = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const queryParams = req.query;
  let expenses;

  if (queryParams) {
    const formatQuery = formatExpenseQuery(queryParams);
    expenses = await findAllExpenses({ createdBy: userId, ...formatQuery });
  } else {
    expenses = await findAllExpenses({ createdBy: userId });
  }

  return res.status(StatusCodes.OK).json({ expenses });
};

/**
 * @function getAnExpense
 * @returns a singular expense for a user, get by using the ID
 */
const getAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const { expenseId } = req.params;

  const expense = await findAnExpense({ createdBy: userId, _id: expenseId });

  return res.status(StatusCodes.OK).json({ expense });
};

/**
 * @function createAnExpense
 * @returns the newly created expense
 */
const createAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  let requestBody = req.body;
  let categories: Array<ICategory | null> = [];

  //   Check if any categories
  if (requestBody?.category && requestBody.category.length > 0) {
    let allCategories = await findAllCategories();

    allCategories.filter(async (category: any) => {
      if (requestBody.category.includes(category._id.toString())) {
        categories.push(category);
      }
    });
  }
  // Set the category, as objects rather than just the id
  requestBody.category = categories;

  const expense = await createExpense(userId, requestBody);

  return res.status(StatusCodes.CREATED).json({ expense });
};

/**
 * @function updateAnExpense
 * @returns makes request to update the resource, then it find it with the applied changes
 */
const updateAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const { expenseId } = req.params;
  const update = req.body;

  const expense = await updateExpense(expenseId, userId, update);

  const updatedExpense = await findAnExpense({
    createdBy: userId,
    _id: expense!._id,
  });

  return res.status(StatusCodes.OK).json({ expense: updatedExpense });
};

/**
 * @function deleteAnExpense
 * @returns a successful deletion status code
 */
const deleteAnExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params;

  await deleteExpense(expenseId);

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export {
  getAllExpenses,
  getAnExpense,
  createAnExpense,
  updateAnExpense,
  deleteAnExpense,
};
