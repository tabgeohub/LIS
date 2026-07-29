import { EnrichedPointType, FlightPlanType } from "Types";
import { SelectFromSourceItemPoint } from "./mapSourceItems";

export type SubmitSelectedPointsInput = {
  selectedPlan: FlightPlanType;
  checkedPoints: SelectFromSourceItemPoint[];
  dbPoints: EnrichedPointType[];
  filteredPlans: FlightPlanType[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
};
