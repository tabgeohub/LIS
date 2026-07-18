import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export type ApplyAddPointsSuccessInput = {
  selectedPlan: FlightPlanType;
  uniquePointIds: number[];
  standalonePoints: EnrichedPointType[];
  updatedGeometries: Geometry[];
  newlySelectedStandalonePoints: EnrichedPointType[];
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
