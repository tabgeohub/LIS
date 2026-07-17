import { useRegionalFlightPlans } from "./useRegionalFlightPlansCore";
import type { FlightPlanRegioQueryInput } from "./regionalFlightPlanQueryConfig";

export type { FlightPlanRegioQueryInput } from "./regionalFlightPlanQueryConfig";

export const useFlightPlansList = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("list", input);
export const useUnPreparedPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("unPrepared", input);
export const usePrepreparedFlightPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("preprepared", input);
export const useFullPreparedFlightPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("fullPrepared", input);
