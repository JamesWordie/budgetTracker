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
} from "../services/expense.services";
import log from "../logger";
import { IExpenseSearch } from "../interfaces/exports.interfaces";
import { BadRequestError } from "../errors";

/**
 * @function getAllExpenses
 * @returns all expenses for a specific user
 *
 * @todo add query params into the request for complex filtering, eg date range, category, tags, etc.
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

  const expense = await createExpense(userId, req.body);

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

// Private Functions
const formatExpenseQuery = (params?: any) => {
  let queryObject: Partial<IExpenseSearch> = {};
  const {
    startDate,
    endDate,
    startValue,
    endValue,
    expenseName,
    isIncome,
    isSubscription,
    subscriptionPeriod,
  } = params!;

  if (expenseName) {
    queryObject = {
      ...queryObject,
      expenseName: new RegExp(expenseName, "gi"),
    };
  }

  if (startDate || endDate) {
    let today = new Date();
    queryObject = {
      ...queryObject,
      createdAt: {
        $gte: startDate
          ? parseDate(startDate)
          : new Date(2022, today.getMonth() - 1, today.getDate()),
        $lte: endDate ? parseDate(endDate, true) : today,
      },
    };
  }

  if (startValue || endValue) {
    queryObject = {
      ...queryObject,
      expenseValue: { $gte: startValue ?? 0, $lte: endValue ?? null },
    };
  }

  if (isIncome) {
    queryObject = { ...queryObject, isIncome };
  }

  if (isSubscription) {
    queryObject = { ...queryObject, isSubscription };
  }

  if (subscriptionPeriod) {
    queryObject = { ...queryObject, subscriptionPeriod };
  }

  log.info(queryObject);

  return queryObject;
};

const parseDate = (date: string, endDate?: boolean) => {
  const [year, month, day]: Array<string> = date.split("-");

  if (!year || !month || !day)
    throw new BadRequestError("Date format is incorrect, must be yyyy-mm-dd");

  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    !endDate ? parseInt(day) : parseInt(day) + 1
  );
};

export {
  getAllExpenses,
  getAnExpense,
  createAnExpense,
  updateAnExpense,
  deleteAnExpense,
};
