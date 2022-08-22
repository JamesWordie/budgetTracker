// External
import { Types } from "mongoose";

export interface ICategory {
  name: string;
  createdBy: Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
