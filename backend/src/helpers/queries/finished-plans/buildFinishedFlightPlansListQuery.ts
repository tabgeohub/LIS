import {
  buildAttachmentsLateralJoin,
  buildFinishedPlanDetailsPointJsonbObject,
} from "../points/pointJson";
import { appendRegioFilter } from "../shared/regioFilter";
import { DEFAULT_FINISHED_REGIO_FILTER } from "./buildFinishedPlansWithPointsHelpers";

export function buildFinishedFlightPlansListQuery(
  regio_id?: unknown
): { query: string; params: unknown[] } {
  const params: unknown[] = [];
  const pointJson = buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ffp.point_order",
    pointCommentExpr: "ffp.pointComment",
    attachmentsExpr: "att_list.attachments",
  });
  let query = buildFinishedFlightPlansListSelect(pointJson);
  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "fp.regio_id",
    options: DEFAULT_FINISHED_REGIO_FILTER,
  });
  query += `
      GROUP BY fp.id, fpp.path;`;
  return { query, params };
}

function buildFinishedFlightPlansListSelect(pointJson: string): string {
  return `
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
        ) AS points_data,
        fpp.path AS path
      FROM lis.flightplans fp
      JOIN lis.finished_plans ffp ON ffp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ffp.point_id
      ${buildAttachmentsLateralJoin("ffp.attachments_id", "att_list")}
      LEFT JOIN lis.finished_plans_path fpp ON fpp.planid = fp.id
      WHERE fp.status = 'finished'`;
}
