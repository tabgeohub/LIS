import { Router } from "express";
import { getTimeRange } from "./getTimeRange";
import { getFinishedPlansTimeslider } from "./getFinishedPlansTimeslider";
import { getPointPlanImages } from "./getPointPlanImages";

const router = Router();

router.get("/getTimeRange", getTimeRange);
router.get("/getFinishedPlansTimeslider", getFinishedPlansTimeslider);
router.get("/pointPlanImages", getPointPlanImages);

export default router;
