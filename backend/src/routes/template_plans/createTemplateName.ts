import { Request, Response } from "express";
import { missingFields } from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import {
  ensureTemplateNameAvailable,
} from "../../helpers/queries/templates/templatePlanHelpers";
import { respondTemplateCreateError } from "./createTemplateFlightPlanHelpers";

export async function createTemplateName(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.body;

  if (getMissingFields(req.body, ["name"]).length > 0) {
    missingFields(res);
    return;
  }

  try {
    if (!(await ensureTemplateNameAvailable(name, res))) return;

    res.status(201).json({
      message: "De vluchttemplate is succesvol opgeslagen",
    });
  } catch (err) {
    respondTemplateCreateError(res, err);
  }
}
