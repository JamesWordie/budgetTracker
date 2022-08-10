import { Express, Request, Response } from "express";
import userRouter from "./user.routes";
import sessionRouter from "./session.routes";
import destinationRouter from "./destination.js";
import authenticateUser from "../middleware/authentication.js";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Register A User
  app.use("/api/v1/users", userRouter);

  // Login A User (Session's)
  app.use("/api/v1/sessions", sessionRouter);

  // Destination
  //   app.use("/api/v1/destination", authenticateUser, destinationRouter); // Authenticate all routes for jobs
}
