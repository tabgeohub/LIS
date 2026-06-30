import { Request, Response } from "express";
import { fetchTemplateFlightPlanList } from "../../helpers/queries/templates/templatePlanHelpers";

export async function getTemplateFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchTemplateFlightPlanList(req, res);
}
