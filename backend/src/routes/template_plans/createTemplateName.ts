import { Request, Response } from "express";
import { rejectIfMissingFields } from "../../helpers/http/rejectIfMissingFields";
import { ensureTemplateNameAvailable } from "../../helpers/queries/templates/templatePlanHelpers";
import { respondTemplateCreateError } from "./createTemplateFlightPlanHelpers";

export async function createTemplateName(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.body;

  if (rejectIfMissingFields(res, req.body, ["name"])) {
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
