import { Request, Response } from "express";
import { pool } from "../../db";
import { created, missingFields, serverError } from "../../helpers/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/validateBody";
import {
  findTemplatePlanByName,
  respondTemplateNameTaken,
} from "../../helpers/queries/templates/templatePlanHelpers";

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
    const existingTemplate = await findTemplatePlanByName(name);

    if (existingTemplate.rows.length > 0) {
      respondTemplateNameTaken(res);
      return;
    }

    const result = await pool.query(
      `INSERT INTO lis.template_plans (
        points,
        name,
        regio_id
      )
      VALUES (
        $1, 
        $2,
        $3
      )
      RETURNING *;`,
      [points, name, regio_id]
    );

    created({
      res,
      result: result.rows[0],
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
