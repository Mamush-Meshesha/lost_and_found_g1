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
import {
  submitProof,
  getItemProofs,
  reviewProof,
} from "../controllers/proofControllers.js";

const router = Router();

// Public
router.get("/", authMiddleware, getItems);
router.get("/:id",authMiddleware, getItemById);

// Asker answers the item's proof question. Holder accepts or rejects.
router.post("/:id/proof", authMiddleware, submitProof);
router.get("/:id/proof", authMiddleware, getItemProofs);
router.patch("/:id/proof/:proofId", authMiddleware, reviewProof);

// Authenticated
router.post("/", authMiddleware, upload.array("images", 5), createItem);
router.patch("/:id",authMiddleware, upload.array("images", 5), updateItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
