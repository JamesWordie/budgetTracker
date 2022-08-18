// External
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * @function notFoundMiddleWare middleware for not found responses
 * @returns a not found status code and message
 */
const notFoundMiddleWare = (req: Request, res: Response) =>
  res.status(StatusCodes.NOT_FOUND).send("Route does not exist");

export default notFoundMiddleWare;
