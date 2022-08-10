import { Types } from "mongoose";

export interface IExpense {
  name: string;
  value: number;
  createdBy: Types.ObjectId;
}
