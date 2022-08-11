import { Express, Request, Response } from "express";
import userRouter from "./user.routes";
import sessionRouter from "./session.routes";
import expenseRouter from "./expense.routes";

export default function (app: Express) {
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
