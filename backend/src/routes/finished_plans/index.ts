import { Router } from "express";
import { createFinishedPlan } from "./createFinishedPlan";
import { getFinishedFlightPlans } from "./getFinishedFlightPlans";
import { deletePoint } from "./deletePoint";
import { getPlanPath } from "./getPlanPath";
import { getPartialFinishedFlightPlans } from "./getPartialFinishedPlans";
import { getSingleFinishedFlightPlan } from "./getSingleFinishedFlightPlan";
import { updateFinishedPointAttachments } from "./updateFinishedPointAttachments";
import { createAttachment } from "./createAttachment";
import { getAttachmentsPlanSinglePoint } from "./getAttachmentsPlanSinglePoint";

const router = Router();

// Post
router.post("/", createFinishedPlan);
router.post("/attachment", createAttachment);

// Get
router.get("/", getFinishedFlightPlans);
router.get("/getPlanPath/:planId", getPlanPath);

router.get("/getPartialFinishedFlightPlans", getPartialFinishedFlightPlans);
router.get("/getSingleFinishedFlightPlan/:planId", getSingleFinishedFlightPlan);
router.get("/getAttachmentsPlanSinglePoint", getAttachmentsPlanSinglePoint);

// Delete
router.delete("/points/:data", deletePoint);

// Patch
router.patch(
  "/points/finishedPointAttachments",
  updateFinishedPointAttachments
);

export default router;
