import { Router } from "express";
import {
  getAllUserSessions,
  createUserSession,
  invalidateUserSession,
} from "../controllers/session.controller";
import requireUser from "../middleware/requireUser";
const router = Router();

// Get all User Sessions
router.get("/", requireUser, getAllUserSessions);

// Create a Session
router.post("/", createUserSession);

// Logout a User/Delete a Session
router.delete("/", requireUser, invalidateUserSession);

export default router;
