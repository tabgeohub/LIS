import { buildFinishedPlanDetailsPointJsonbObject } from "../points/pointJson";
import { buildSingleFinishedPlanCtes } from "./singleFinishedPlanCtes";
import { buildSingleFinishedFlightPlanSelect } from "../../repositories/finishedPlansQuerySql";

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
