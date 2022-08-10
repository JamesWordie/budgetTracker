// Setup
import "dotenv/config";
import "express-async-errors";
import express from "express";
// Security
import helmet from "helmet";
import cors from "cors";
// import rateLimit from "express-rate-limit";
// Internals
import connectDB from "./db/connect";
import routes from "./routes/index.routes";
import notFoundMiddleware from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandler";
import deserializeUser from "./middleware/deserializeUser";
import log from "./logger";

const app = express();
app.use(deserializeUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// extra packages
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 Minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
app.use(helmet());
app.use(cors());

routes(app);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connectDB();

  //   routes(app);
});
