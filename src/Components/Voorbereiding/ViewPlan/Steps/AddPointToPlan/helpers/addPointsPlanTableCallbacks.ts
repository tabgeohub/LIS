import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

/** Shared plan-table update callbacks used by add-points-to-plan helpers. */
export type AddPointsPlanTableCallbacks = {
  yellowGraphicsLayer: GraphicsLayer | null | undefined;
  setSelectedPlan: (plan: FlightPlanType) => void;
  setPointsTable: (points: EnrichedPointType[]) => void;
  setGeometriesTable: (geometries: Geometry[]) => void;
  setGeometries: (geometries: Geometry[]) => void;
  setOpenTable: (open: boolean) => void;
  filteredPlans: FlightPlanType[];
  setFilteredPlans: (plans: FlightPlanType[]) => void;
  logAction: (input: {
    message: string;
    newData?: Record<string, unknown>;
  }) => void;
  setStep: (step: number) => void;
};
