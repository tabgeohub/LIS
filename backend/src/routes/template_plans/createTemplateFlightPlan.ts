import { Request, Response } from "express";
import { pool } from "../../db";
import { created, missingFields, serverError } from "../../helpers/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/validateBody";

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
    const existingTemplate = await pool.query(
      `SELECT * FROM lis.template_plans WHERE name = $1`,
      [name]
    );

    if (existingTemplate.rows.length > 0) {
      res.status(400).json({
        result: null,
        message: "Er bestaat al een sjabloon met deze naam.",
      });
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

    created(res, result.rows[0], "De vluchttemplate is succesvol opgeslagen");
  } catch (err) {
    serverError(
      res,
      "Error creating template flight plan:",
      `Failed to creating template flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
