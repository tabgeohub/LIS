import { pickFlightPlanPersistenceFields } from "hooks/flightPlan/pickFlightPlanPersistenceFields";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function createReportPlanClickLogData(plan: FinishedFlightPlanType) {
  return {
    vluchtnummer: plan.vluchtnummer,
    ...pickFlightPlanPersistenceFields(plan),
  };
}
