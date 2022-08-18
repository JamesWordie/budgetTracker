// External
import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * @function requiresUser - middleware to confirm user attached to the headers
 * @returns next function - middleware
 */
const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "userData");

  if (!user) {
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }

  return next();
};

export default requiresUser;
