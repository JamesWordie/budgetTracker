// External
import mongoose from "mongoose";
import "dotenv/config";
// Config
import log from "../logger";

/**
 * @function connectDB - database connection
 */
const connectDB = () => {
  const dbUri = process.env.MONGO_URI!;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      log.info("Database Connected");
    })
    .catch((error) => {
      log.error("DB connection error", error);
      process.exit(1);
    });
};

export default connectDB;
