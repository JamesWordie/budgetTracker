import { Router } from "express";
import {
  getAllUserSessions,
  createUserSession,
  invalidateUserSession,
} from "../controllers/session.controller";
import { requiresUserMiddleware } from "../middleware";

const router = Router();

// Get all User Sessions
router.get("/", requiresUserMiddleware, getAllUserSessions);

// Create a Session
router.post("/", createUserSession);

// Logout a User/Delete a Session
router.delete("/", requiresUserMiddleware, invalidateUserSession);

export default router;
