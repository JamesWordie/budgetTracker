// External
import { Router } from "express";
// Config
import { requiresUserMiddleware } from "../middleware";
import {
  getAllCategories,
  getACategory,
  createACategory,
  updateACategory,
  deleteACategory,
} from "../controllers/category.controller";

const router = Router();

// Get All Categories
router.get("/", requiresUserMiddleware, getAllCategories);

// Get A Category
router.get("/:categoryId", requiresUserMiddleware, getACategory);

// Create A Category
router.post("/", requiresUserMiddleware, createACategory);

// Update A Category
router.patch("/:categoryId", requiresUserMiddleware, updateACategory);

// Delete A Category
router.delete("/:categoryId", requiresUserMiddleware, deleteACategory);

export default router;
