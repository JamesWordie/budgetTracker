// External
import { Types } from "mongoose";

export interface IExpense {
  expenseName: string;
  expenseValue: number;
  createdBy: Types.ObjectId;
  isSubscription: boolean;
  subscriptionPeriod: SubscriptionPeriod | null;
  subscriptionRenewalDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  isIncome: boolean;
  category: [Types.ObjectId] | [];
}

export interface IExpenseSearch extends IExpense {
  expenseValue: any;
  createdAt: any;
  expenseName: any;
}

export type SubscriptionPeriod =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annually";
