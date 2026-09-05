import { pickFlightPlanPersistenceFields } from "helpers/plans/pickFlightPlanPersistenceFields";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function createReportPlanClickLogData(plan: FinishedFlightPlanType) {
  return {
    vluchtnummer: plan.vluchtnummer,
    ...pickFlightPlanPersistenceFields(plan),
  };
}
