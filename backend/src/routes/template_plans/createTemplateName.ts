import { Request, Response } from "express";
import { pool } from "../../db";

export async function createTemplateName(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
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

    res.status(201).json({
      message: "De vluchttemplate is succesvol opgeslagen",
    });
  } catch (err) {
    console.error(
      "Error creating template flight plan:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to creating template flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
