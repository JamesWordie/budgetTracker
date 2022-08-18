// External
import { Router } from "express";
// Config
import { createNewUser } from "../controllers/user.controller";

const router = Router();

// Register A User -> Create A User
router.post("/", createNewUser);

export default router;
