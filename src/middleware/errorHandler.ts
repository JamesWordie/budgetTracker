// External
import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";

/**
 * @function errorHandlerMiddleware middleware for handling errors
 * @returns next function - middleware
 *
 * @todo - check whether this actually works???
 */
const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later.",
  };

  // Validation Error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field, ${Object.values(
      err.keyValue
    )} is already in use, please choose another.`;
    customError.statusCode = StatusCodes.CONFLICT;
  }

  // Cast Error
  if (err.name === "CastError") {
    customError.msg = `No item found with the ID ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
