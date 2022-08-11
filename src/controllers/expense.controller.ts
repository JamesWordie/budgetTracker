import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { get } from "lodash";
import {
  findAllExpenses,
  findAnExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expense.services";
import log from "../logger";

const getAllExpenses = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");

  const expenses = await findAllExpenses({ createdBy: userId });

  return res.status(StatusCodes.OK).json({ expenses });
};

const getAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const { expenseId } = req.params;

  const expense = await findAnExpense({ createdBy: userId, _id: expenseId });

  return res.status(StatusCodes.OK).json({ expense });
};

const createAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");

  const expense = await createExpense(userId, req.body);

  return res.status(StatusCodes.CREATED).json({ expense });
};

const updateAnExpense = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const { expenseId } = req.params;
  const update = req.body;

  const expense = await updateExpense(expenseId, userId, update);

  const updatedExpense = await findAnExpense({
    createdBy: userId,
    _id: expense!._id,
  });

  return res.status(StatusCodes.OK).json({ updatedExpense });
};

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
