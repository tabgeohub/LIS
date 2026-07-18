import { buildFinishedPlanDetailsPointJsonbObject } from "../points/pointJson";
import { buildSingleFinishedPlanCtes } from "./singleFinishedPlanCtes";

export function buildSingleFinishedFlightPlanQuery(): string {
  const pointJson = buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ppp.point_order",
    pointCommentExpr: "ppp.point_comment",
    attachmentsExpr: "ap.attachments",
    includeGeometry: true,
  });
  return `${buildSingleFinishedPlanCtes()}
      ${buildSingleFinishedFlightPlanSelect(pointJson)}`;
}

function buildSingleFinishedFlightPlanSelect(pointJson: string): string {
  return `SELECT
        fp.*,
        fpp.path AS path,
        fpp.flighttime AS flighttime,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
          ORDER BY ppp.point_order NULLS LAST, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp
        ON ppp.plan_id = fp.id
      JOIN lis.points pt
        ON pt.id = ppp.point_id
      LEFT JOIN attachments_per_point ap
        ON ap.point_id = ppp.point_id
      LEFT JOIN lis.geometries g
        ON g.id = pt.geometry_id
      LEFT JOIN lis.finished_plans_path fpp
        ON fpp.planid = fp.id
      WHERE fp.status = 'finished'
        AND fp.id = $1
      GROUP BY fp.id, fpp.path, fpp.flighttime;
      `;
}
