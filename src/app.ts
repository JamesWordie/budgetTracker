// Setup
import "dotenv/config";
import "express-async-errors";
import express from "express";
// Security
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
// Internals
import connectDB from "./db/connect";
import routes from "./routes/index.routes";
import {
  deserializeUserMiddleware,
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "./middleware";
import log from "./logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// extra packages
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(cors());

// Routing & Middleware
app.use(deserializeUserMiddleware);
routes(app);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connectDB();
});
