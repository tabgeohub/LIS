import type { Response } from "express";
import { pool } from "../../db";
import { created, serverError } from "../../helpers/http/routeResponses";

export async function insertTemplateFlightPlan(input: {
  points: unknown;
  name: string;
  regio_id: unknown;
}): Promise<Record<string, unknown>> {
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
    [input.points, input.name, input.regio_id]
  );
  return result.rows[0];
}

export async function createAndRespondTemplatePlan(input: {
  res: Response;
  points: unknown;
  name: string;
  regio_id: unknown;
}): Promise<void> {
  const row = await insertTemplateFlightPlan({
    points: input.points,
    name: input.name,
    regio_id: input.regio_id,
  });
  created({
    res: input.res,
    result: row,
    message: "De vluchttemplate is succesvol opgeslagen",
  });
}

export function respondTemplateCreateError(res: Response, err: unknown): void {
  serverError({
    res,
    logLabel: "Error creating template flight plan:",
    message: `Failed to creating template flight plan: ${
      err instanceof Error ? err.message : String(err)
    }`,
    err,
  });
}
