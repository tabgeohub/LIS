import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export type SubmitAddPointsToPlanInput = {
  selectedPlan: FlightPlanType;
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  dbPoints: EnrichedPointType[];
  dbGeometries: Geometry[];
  yellowGraphicsLayer: GraphicsLayer | null | undefined;
  update: (args: {
    data: { points: number[]; id: number };
    onSuccess: () => void;
  }) => void;
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
