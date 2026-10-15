import { buildFinishedPlanDetailsPointJsonbObject } from "../points/pointJson";
import { buildSingleFinishedPlanCtes } from "./singleFinishedPlanCtes";
import { buildSingleFinishedFlightPlanSelect } from "../../repositories/finishedPlansQuerySql";

export function buildSingleFinishedFlightPlanQuery(): string {
  const pointJson = buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ppp.point_order",
    pointCommentExpr: "ppp.point_comment",
    attachmentsExpr: "ap.attachments",
    finishedAtExpr: "ppp.finished_at",
    includeGeometry: true,
    // This query is built from finished rows, not UNNEST(fp.points).  Its
    // ordering is therefore the persisted completion ordering.
    geometryMemberOrderExpr: "ppp.point_order",
  });
  return `${buildSingleFinishedPlanCtes()}
      ${buildSingleFinishedFlightPlanSelect(pointJson)}`;
}
