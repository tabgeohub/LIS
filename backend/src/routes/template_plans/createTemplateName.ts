import { Request, Response } from "express";
import { missingFields, serverError } from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import {
  findTemplatePlanByName,
  respondTemplateNameTaken,
} from "../../helpers/queries/templates/templatePlanHelpers";

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
    const existingTemplate = await findTemplatePlanByName(name);

    if (existingTemplate.rows.length > 0) {
      respondTemplateNameTaken(res);
      return;
    }

    res.status(201).json({
      message: "De vluchttemplate is succesvol opgeslagen",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error creating template flight plan:",
      message: `Failed to creating template flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
