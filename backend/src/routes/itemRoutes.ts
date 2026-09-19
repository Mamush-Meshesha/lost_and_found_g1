import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemControllers.js";

const router = Router();

// Public
router.get("/", getItems);
router.get("/:id", getItemById);

// Authenticated
router.post("/", upload.array("images", 5), createItem);
router.patch("/:id", upload.array("images", 5), updateItem);
router.delete("/:id", deleteItem);

export default router;
