import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemControllers.js";

const router = Router();

// Public
router.get("/", authMiddleware, getItems);
router.get("/:id",authMiddleware, getItemById);

// Authenticated
router.post("/", authMiddleware, upload.array("images", 5), createItem);
router.patch("/:id",authMiddleware, upload.array("images", 5), updateItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
