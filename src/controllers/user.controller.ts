import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { createUser } from "../services/user.services";
import { omit } from "lodash";

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
