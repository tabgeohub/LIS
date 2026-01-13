import { Router } from "express";
import { createTemplateFlightPlan } from "./createTemplateFlightPlan";
import { getTemplateFlightPlans } from "./getTemplateFlightPlans";
import { createTemplateName } from "./createTemplateName";

const router = Router();

router.get("/", getTemplateFlightPlans);

// Post
router.post("/", createTemplateFlightPlan);
router.post("/templateName", createTemplateName);

export default router;
