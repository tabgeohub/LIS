import type { EnrichedPointType, FlightPlanType } from "Types";

export type SearchedResultsTargetProps = {
  setFase: (value: string) => void;
  target: string;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
};
