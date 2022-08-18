// External
import StatusCodes from "http-status-codes";
// Config
import CustomAPIError from "./customApi";

/**
 * @class NotFoundError
 */
class NotFoundError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
