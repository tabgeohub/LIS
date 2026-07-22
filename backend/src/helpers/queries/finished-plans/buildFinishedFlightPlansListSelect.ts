import {
  buildAttachmentsLateralJoin,
  buildFinishedPlanDetailsPointJsonbObject,
} from "../points/pointJson";

export function buildFinishedFlightPlansListSelect(pointJson: string): string {
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

export function buildFinishedFlightPlansListPointJson(): string {
  return buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ffp.point_order",
    pointCommentExpr: "ffp.pointComment",
    attachmentsExpr: "att_list.attachments",
  });
}
