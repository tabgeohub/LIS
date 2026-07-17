import { flightPlanKeys } from "lib/queryKeys";

export type FlightPlanRegioKind =
  | "list"
  | "preprepared"
  | "fullPrepared"
  | "unPrepared";

export type FlightPlanRegioQueryInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

export const FLIGHT_PLAN_REGIO_CONFIG: Record<
  FlightPlanRegioKind,
  {
    path: string;
    key: (regioId: string | number) => readonly unknown[];
  }
> = {
  list: { path: "/flightPlans", key: flightPlanKeys.list },
  preprepared: {
    path: "/flightPlans/prepreparedFlightPlans",
    key: flightPlanKeys.preprepared,
  },
  fullPrepared: {
    path: "/flightPlans/fullPreparedFlightPlans",
    key: flightPlanKeys.fullPrepared,
  },
  unPrepared: {
    path: "/flightPlans/unPreparedPlans",
    key: flightPlanKeys.unPrepared,
  },
};
