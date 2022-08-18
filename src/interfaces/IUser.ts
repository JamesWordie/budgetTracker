// External
import { Model } from "mongoose";

export interface IUser {
  _id: string;
  firstname: string;
  surname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  username: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
