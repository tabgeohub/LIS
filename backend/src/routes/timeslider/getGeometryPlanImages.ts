import { Request, Response } from "express";
import { pool } from "../../db";

function parsePlanIds(query: unknown): number[] {
  if (query == null) return [];
  if (Array.isArray(query)) {
    return query
      .flatMap((v) => String(v).split(","))
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n > 0);
  }
  return String(query)
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

/**
 * GET /api/timeslider/geometryPlanImages
 * Query: geometry_id (required), plan_ids (comma-separated or repeated), regio_id (optional)
 *
 * Returns attachments linked on finished_plans for any point that belongs to this geometry,
 * for the given flight plan ids (merged, deduped by attachment id).
 * Mirrors pointPlanImages / Nabewerking finished_plans + attachments pattern.
 */
export async function getGeometryPlanImages(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const geometryIdRaw = req.query.geometry_id;
    const geometryId =
      typeof geometryIdRaw === "string"
        ? parseInt(geometryIdRaw, 10)
        : Array.isArray(geometryIdRaw)
          ? parseInt(String(geometryIdRaw[0]), 10)
          : NaN;

    if (!Number.isFinite(geometryId) || geometryId <= 0) {
      res.status(400).json({
        message:
          "Query param 'geometry_id' is required and must be a positive integer",
      });
      return;
    }

    const planIds = parsePlanIds(req.query.plan_ids);
    if (planIds.length === 0) {
      res.status(400).json({
        message:
          "Query param 'plan_ids' is required (comma-separated plan ids, e.g. plan_ids=1,2,3)",
      });
      return;
    }

    const regioId = req.query.regio_id;
    const isAdmin =
      regioId != null && String(regioId).toLowerCase() === "admin";
    const shouldFilter = regioId != null && !isAdmin;

    const sql = `
      SELECT DISTINCT ON (a.id)
        a.id,
        a.url,
        a.point_id,
        a.attachmentid AS "attachmentid",
        a.taken_at,
        a.location,
        fp.plan_id
      FROM lis.finished_plans fp
      INNER JOIN lis.flightplans fl
        ON fl.id = fp.plan_id
        AND fl.status = 'finished'
      INNER JOIN lis.points p
        ON p.id = fp.point_id
        AND p.geometry_id = $1
      INNER JOIN lis.attachments a
        ON a.id = ANY(COALESCE(fp.attachments_id, ARRAY[]::integer[]))
        AND a.point_id = fp.point_id
      WHERE fp.plan_id = ANY($2::int[])
        ${shouldFilter ? `AND fl.regio_id::text = $3::text` : ""}
      ORDER BY a.id ASC, fp.plan_id ASC;
    `;

    const params: unknown[] = [geometryId, planIds];
    if (shouldFilter) {
      params.push(String(regioId));
    }

    const result = await pool.query(sql, params);

    res.status(200).json({
      geometry_id: geometryId,
      plan_ids: planIds,
      images: result.rows,
    });
  } catch (error: unknown) {
    console.error("❌ Error fetching timeslider geometry plan images:", error);
    res.status(500).json({
      message: "Failed to fetch geometry images for selected plans",
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    });
  }
}
