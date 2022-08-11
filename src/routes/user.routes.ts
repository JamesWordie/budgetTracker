import { Router } from "express";
import { createNewUser } from "../controllers/user.controller";
const router = Router();

// Register A User -> Create A User
router.post("/", createNewUser);

export default router;
