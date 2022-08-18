// External
import pino from "pino";

/**
 * @function log - logger to output to terminal, clean compared to console.log
 *
 * @todo - implement log files on live server once deployed
 */
const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

export default log;
