// External
import { FilterQuery, Types } from "mongoose";
import { omit } from "lodash";
// Config
import { IUser } from "../interfaces/IUser";
import User from "../models/user.model";
import { BadRequestError, DuplicateResourceError } from "../errors";

/**
 * @function createUser
 * @param input IUser data, of the user to be inputted to the DB
 * @returns a user object or throws an error
 */
const createUser = async (input: IUser) => {
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

/**
 * @function validateUser - validates user from the mongoose DB, compares password's
 * @param userProperties pick of IUser, with an email and password
 * @returns a user object, formatted as JSON without the password inside
 */
const validateUser = async (
  userProperties: Pick<IUser, "email" | "password">
) => {
  const { email, password } = userProperties;
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

/**
 * @function findUser
 * @param query FilterQuery of IUser of query params to search the DB
 * @returns a user or undefined
 */
const findUser = async (query: FilterQuery<IUser>) => {
  return User.findOne(query);
};

/**
 * @function checkUser - compares two userId's to confirm they match
 * @param userId from the headers on the request, as formatted going through deserializeUser middleware
 * @param compareUserId 'createdBy' field on the expense
 * @return either undefined or throws a BadRequestError
 */
const checkUser = (
  userId: Types.ObjectId | string,
  compareUserId: Types.ObjectId
) => {
  if (compareUserId !== userId)
    throw new BadRequestError(
      "UserId of session does not match that on the request."
    );
};

export { createUser, validateUser, findUser, checkUser };
