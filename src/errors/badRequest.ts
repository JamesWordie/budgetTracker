// External
import StatusCodes from "http-status-codes";
// Config
import { CustomAPIError } from "./index";

/**
 * @class BadRequestError
 */
class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
