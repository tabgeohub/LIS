import { Request, Response } from "express";
import { pool } from "../../db";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";
import { buildPointsListQuery } from "../../helpers/queries/points/buildPointsListQuery";

export async function getPoints(req: Request, res: Response) {
  try {
    const { sql, params } = buildPointsListQuery({
      naamAandachtspunt: req.query.naamAandachtspunt,
      activiteit: req.query.activiteit,
      organisatie: req.query.organisatie,
      van: req.query.van,
      tot: req.query.tot,
      herhalen: req.query.herhalen,
      status: req.query.status,
      hasGeometry: req.query.hasGeometry,
      regio: resolveRegioFilter(req),
    });

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
