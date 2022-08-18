// External
import StatusCodes from "http-status-codes";
// Config
import { CustomAPIError } from "./index";

/**
 * @class DuplicateResourceError
 */
class DuplicateResourceError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default DuplicateResourceError;
