import { Router } from "express";
import { createTemplateFlightPlan } from "./createTemplateFlightPlan";
import { getTemplateFlightPlans } from "./getTemplateFlightPlans";
import { createTemplateName } from "./createTemplateName";

/**
 * @openapi
 * tags:
 *   - name: TemplatePlans
 *     description: Template flight plans and template names
 */
const router = Router();

router.get("/", getTemplateFlightPlans);
router.post("/", createTemplateFlightPlan);
router.post("/templateName", createTemplateName);

export default router;
