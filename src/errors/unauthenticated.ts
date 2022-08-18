// External
import StatusCodes from "http-status-codes";
// Config
import CustomAPIError from "./customApi";

/**
 * @class UnauthenticatedError
 */
class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
