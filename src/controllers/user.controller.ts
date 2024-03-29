// External
import { Response, Request } from "express";
import { omit } from "lodash";
import { StatusCodes } from "http-status-codes";
// Config
import { BadRequestError } from "../errors";
import { createUser } from "../services/user.services";

/**
 * @function createNewUser - register a new user
 * @returns the newly created user, omitting the password
 *
 * @todo - need to implement the access and refresh token here too???
 */
const createNewUser = async (req: Request, res: Response) => {
  // Optional as already got mongoose validators
  const { firstname, surname, email, password } = req.body;
  if (!firstname || !surname || !email || !password) {
    throw new BadRequestError("Please provide a name, email and password");
  }

  //   Hashing the Password - handled as 'pre' inside of the user schema (User model file)
  const user = await createUser({ ...req.body });

  res
    .status(StatusCodes.CREATED)
    .json({ user: omit(user.toJSON(), "password") });
};

export { createNewUser };
