import { Router } from "express";
import { searchItems } from "../controllers/Items.search.controller";

const router = Router();

router.get("/", searchItems);

export default router;