import { Request, Response } from "express";
import { missingFields } from "../../helpers/http/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/http/validateBody";
import { ensureTemplateNameAvailable } from "../../helpers/queries/templates/templatePlanHelpers";
import {
  createAndRespondTemplatePlan,
  respondTemplateCreateError,
} from "./createTemplateFlightPlanHelpers";

export async function createTemplateFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { points, name, regio_id } = req.body;

  if (
    getMissingFields(req.body, ["name"]).length > 0 ||
    !requireArray(points)
  ) {
    missingFields(res);
    return;
  }

  try {
    if (!(await ensureTemplateNameAvailable(name, res))) return;
    await createAndRespondTemplatePlan({ res, points, name, regio_id });
  } catch (err) {
    respondTemplateCreateError(res, err);
  }
}
