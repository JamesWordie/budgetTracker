// External
import { Router } from "express";
// Config
import { requiresUserMiddleware } from "../middleware";
import {
  getAllExpenses,
  getAnExpense,
  createAnExpense,
  updateAnExpense,
  deleteAnExpense,
} from "../controllers/expense.controller";

const router = Router();

// Get All Expenses
router.get("/", requiresUserMiddleware, getAllExpenses);

// Get An Expense
router.get("/:expenseId", requiresUserMiddleware, getAnExpense);

// Create An Expense
router.post("/", requiresUserMiddleware, createAnExpense);

// Update An Expense
router.patch("/:expenseId", requiresUserMiddleware, updateAnExpense);

// Delete An Expense
router.delete("/:expenseId", requiresUserMiddleware, deleteAnExpense);

export default router;
