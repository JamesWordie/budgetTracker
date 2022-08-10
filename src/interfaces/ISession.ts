import { IUser } from "./exports.interfaces";

export interface ISession {
  _id: string;
  user: IUser["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionAccess {
  user: Omit<IUser, "password">;
  session: ISession;
}
