import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

import {
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemControllers.js";
import { searchItems } from "../controllers/Items.search.controller.js";
import {
  submitProof,
  getItemProofs,
  reviewProof,
} from "../controllers/proofControllers.js";

const router = Router();

router.get("/", authMiddleware, searchItems);
router.get("/:id", authMiddleware, getItemById);
router.post("/:id/proof", authMiddleware, submitProof);
router.get("/:id/proof", authMiddleware, getItemProofs);
router.patch("/:id/proof/:proofId", authMiddleware, reviewProof);

router.post("/", authMiddleware, upload.array("images", 5), createItem);
router.patch("/:id", authMiddleware, upload.array("images", 5), updateItem);
router.delete("/:id", authMiddleware, deleteItem);



export default router;
