// External
import { Types } from "mongoose";

export interface IExpense {
  name: string;
  value: number;
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

export type SubscriptionPeriod =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annually";
