import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { finalizeCoordinateValues } from "./coordinateFinalize";
import { updateSavedGraphics } from "./pointMapGraphics";

type SubmitPointCoordinatesInput = {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType | null;
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  update: (payload: unknown, onSuccess?: (data: { result?: boolean }) => void) => void;
  setSelectedPoint: (point: FinishedPointType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setAction: (value: string) => void;
  logAction: (entry: {
    message: string;
    step: string;
    newData: Record<string, unknown>;
  }) => void;
};

export function submitPointCoordinateUpdate(input: SubmitPointCoordinatesInput) {
  const finalCoords = finalizeCoordinateValues(input.coordinateSystem, {
    longitude: input.longitude,
    latitude: input.latitude,
    xcoordinaat_rd: input.xcoordinaat_rd,
    ycoordinaat_rd: input.ycoordinaat_rd,
  });

  const payload = {
    ...input.selectedPoint,
    ...finalCoords,
    regio_id: input.selectedPoint.regio_id,
    vertrouwelijk: input.selectedPoint.vertrouwelijk,
    herhalen: input.selectedPoint.herhalen,
    user_id: input.selectedPoint.user_id,
    activiteit_id: input.selectedPoint.activiteit_id,
    organisatie_id: input.selectedPoint.organisatie_id,
    specifiek_letten_op: input.selectedPoint.specifiek_letten_op,
    datum: input.selectedPoint.datum,
    id: input.selectedPoint.id,
  };

  input.update(payload, (responseData) => {
    if (!responseData.result || !input.selectedPlan) return;

    const updatedPoint = { ...input.selectedPoint, ...finalCoords };
    input.setSelectedPoint(updatedPoint);
    input.setSelectedPlan({
      ...input.selectedPlan,
      points_data: [
        ...input.selectedPlan.points_data.filter(
          (p) => p.id !== input.selectedPoint.id
        ),
        updatedPoint,
      ],
    });

    if (
      input.mapView &&
      input.pointsGraphicsLayer &&
      input.yellowGraphicsLayer &&
      input.redGraphicsLayer
    ) {
      updateSavedGraphics({
        mapView: input.mapView,
        pointsGraphicsLayer: input.pointsGraphicsLayer,
        yellowGraphicsLayer: input.yellowGraphicsLayer,
        redGraphicsLayer: input.redGraphicsLayer,
        point: updatedPoint,
        longitude: finalCoords.longitude,
        latitude: finalCoords.latitude,
      });
    }

    input.setAction("form");
  });

  input.logAction({
    message: "User updated point coordinates",
    step: "Second step - Edit point coordinates",
    newData: { coordinateSystem: input.coordinateSystem, ...finalCoords },
  });
}
