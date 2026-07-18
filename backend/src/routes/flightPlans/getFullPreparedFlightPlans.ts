import { createRegionalFlightPlanListHandler } from "./createRegionalFlightPlanListHandler";
import { PARTIAL_FLIGHT_PLAN_LIST_ERROR_OPTIONS } from "./partialFlightPlanListErrorOptions";

export const getFullPreparedFlightPlans = createRegionalFlightPlanListHandler({
  columnPreset: "prepared",
  pointPreset: "minimal",
  where: "fp.status = 'prepared'",
  ...PARTIAL_FLIGHT_PLAN_LIST_ERROR_OPTIONS,
});
