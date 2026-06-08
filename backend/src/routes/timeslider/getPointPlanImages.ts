import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFinishedPlanRegioWhereClause } from "../../helpers/queries/buildFinishedPlanQuery";
import { parsePlanIds } from "../../helpers/queries/parsePlanIds";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

const TIMESLIDER_REGIO_FILTER = {
  caseInsensitiveAdmin: true,
  when: "provided" as const,
  castAsText: true,
};

/**
 * GET /api/timeslider/pointPlanImages
 * Query: point_id (required), plan_ids (comma-separated or repeated), regio_id (optional, same as other timeslider routes)
 *
 * Returns all attachments for this point that are linked on finished_plans rows
 * for the given flight plan ids (merged, deduped by attachment id).
 */
export async function getPointPlanImages(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pointIdRaw = req.query.point_id;
    const pointId =
      typeof pointIdRaw === "string"
        ? parseInt(pointIdRaw, 10)
        : Array.isArray(pointIdRaw)
          ? parseInt(String(pointIdRaw[0]), 10)
          : NaN;

    if (!Number.isFinite(pointId) || pointId <= 0) {
      res.status(400).json({
        message: "Query param 'point_id' is required and must be a positive integer",
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

    const regioId = resolveRegioFilter(req);
    const params: unknown[] = [pointId, planIds];
    const regioClause = buildFinishedPlanRegioWhereClause(
      regioId,
      params,
      "fl.regio_id",
      TIMESLIDER_REGIO_FILTER
    );

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
      INNER JOIN lis.attachments a
        ON a.id = ANY(COALESCE(fp.attachments_id, ARRAY[]::integer[]))
        AND a.point_id = fp.point_id
      WHERE fp.point_id = $1
        AND fp.plan_id = ANY($2::int[])
        ${regioClause}
      ORDER BY a.id ASC, fp.plan_id ASC;
    `;

    const result = await pool.query(sql, params);

    res.status(200).json({
      point_id: pointId,
      plan_ids: planIds,
      images: result.rows,
    });
  } catch (error: unknown) {
    console.error("❌ Error fetching timeslider point plan images:", error);
    res.status(500).json({
      message: "Failed to fetch point images for selected plans",
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    });
  }
}
