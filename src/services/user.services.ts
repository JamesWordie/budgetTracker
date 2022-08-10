import { IUser } from "../interfaces/IUser";
import User from "../models/user.model";
import { omit } from "lodash";
import { DuplicateResourceError } from "../errors";
import { FilterQuery } from "mongoose";

export const createUser = async (input: IUser) => {
  try {
    return await User.create(input);
  } catch (error: any) {
    let errorMessage =
      error.code === 11000
        ? `Duplicate value entered for the ${Object.keys(
            error.keyValue
          )} field, ${Object.values(
            error.keyValue
          )} is already in use, please choose another.`
        : "Something went wrong, please try again.";
    throw new DuplicateResourceError(errorMessage);
  }
};

export const validateUser = async (
  userProperties: Pick<IUser, "email" | "password">
) => {
  const { email, password } = userProperties;
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const findUser = async (query: FilterQuery<IUser>) => {
  return User.findOne(query);
};
