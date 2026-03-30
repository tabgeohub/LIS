import { Router } from "express";
import { getTimeRange } from "./getTimeRange";
import { getFinishedPlansTimeslider } from "./getFinishedPlansTimeslider";

const router = Router();

router.get("/getTimeRange", getTimeRange);
router.get("/getFinishedPlansTimeslider", getFinishedPlansTimeslider);

export default router;
