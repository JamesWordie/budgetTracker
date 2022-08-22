// External
import { Schema, model, Types } from "mongoose";
// Config
import { IExpense } from "../interfaces/exports.interfaces";

/**
 * @class ExpenseSchema
 * setup of the expense model
 */
const ExpenseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a expense name"],
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    isSubscription: {
      type: Boolean,
      default: false,
    },
    subscriptionPeriod: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "annually", null],
      default: null,
    },
    subscriptionRenewalDate: {
      type: Date,
      default: null,
    },
    isIncome: {
      type: Boolean,
      default: false,
      required: [true, "Please provide whether income or not (ie expense)."],
    },
    category: {
      type: [Types.ObjectId],
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = model<IExpense>("Expense", ExpenseSchema);

export default Expense;
