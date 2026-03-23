import { Router } from "express";
import { getTimeRange } from "./getTimeRange";

const router = Router();

router.get("/getTimeRange", getTimeRange);

export default router;
