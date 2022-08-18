// External
import { Express, Request, Response } from "express";
// Config
import userRouter from "./user.routes";
import sessionRouter from "./session.routes";
import expenseRouter from "./expense.routes";

export default function (app: Express) {
  // solely for the purpose of confirming the server is live/live site is up and running
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Register A User
  app.use("/api/v1/users", userRouter);

  // Login A User (Session's)
  app.use("/api/v1/sessions", sessionRouter);

  // CRUD for Expenses
  app.use("/api/v1/expenses", expenseRouter);
}
