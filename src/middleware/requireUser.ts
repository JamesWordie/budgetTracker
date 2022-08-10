import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

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
