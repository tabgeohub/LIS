import { buildAttachmentsAggregationExpr } from "../points/pointJson";

export function buildSingleFinishedPlanCtes(): string {
  return `
      WITH ffp_rows AS (
        SELECT *
        FROM lis.finished_plans
        WHERE plan_id = $1
      ),
      points_per_plan AS (
        SELECT
          plan_id,
          point_id,
          MAX(point_order) AS point_order,
          MAX(pointcomment) AS point_comment
        FROM ffp_rows
        GROUP BY plan_id, point_id
      ),
      fp_point_attachments AS (
        SELECT DISTINCT ON (point_id)
          point_id,
          attachments_id
        FROM ffp_rows
        ORDER BY point_id, point_order DESC NULLS LAST
      ),
      attachments_per_point AS (
        SELECT
          fpa.point_id,
          ${buildAttachmentsAggregationExpr("fpa.attachments_id")} AS attachments
        FROM fp_point_attachments fpa
      )`;
}
