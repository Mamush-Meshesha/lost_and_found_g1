import { Router } from "express";
import { searchReports } from "../controllers/Items.search.controller";

const router = Router();

router.get("/", searchReports);

export default router;