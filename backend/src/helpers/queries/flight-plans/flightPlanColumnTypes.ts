export type FlightPlanColumnPreset =
  | "all"
  | "search"
  | "prepared"
  | "minimal"
  | "byId"
  | "template";

export type BuildFlightPlanSelectColumnsInput = {
  preset: FlightPlanColumnPreset;
  planAlias: string;
  extraSelect?: string;
};
