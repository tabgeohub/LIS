import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import type { FlightPlanType } from "Types";
import {
  mergeFlightPlanPersistenceFields,
  pickFlightPlanPersistenceFields,
} from "Components/HomePage/hooks/flightPlan/pickFlightPlanPersistenceFields";

export function buildRemainingPlanPointGraphics(
  points: FlightPlanType["points"]
): Graphic[] {
  const blueSymbol = new SimpleMarkerSymbol({
    color: "blue",
    size: 12,
    style: "circle",
    outline: {
      color: "white",
      width: 1,
    },
  });

  return points.map((point) => {
    const geometry = new Point({
      x: point.longitude,
      y: point.latitude,
    });

    return new Graphic({
      geometry,
      symbol: blueSymbol,
      attributes: point,
    });
  });
}

export function buildRemovePointPlanAttributes(input: {
  selectedPlan: FlightPlanType;
  pointIdToRemove: number;
}) {
  const { selectedPlan, pointIdToRemove } = input;
  return {
    vluchtnummer: selectedPlan.vluchtnummer,
    ...pickFlightPlanPersistenceFields(selectedPlan),
    points: selectedPlan.points
      .filter((point) => point.id !== pointIdToRemove)
      .flatMap((point) => point.id),
    user_id: selectedPlan.user_id,
    status: selectedPlan.status,
    id: selectedPlan.id,
  };
}

export function applyRemovePointSuccessState(input: {
  selectedPlan: FlightPlanType;
  pointIdToRemove: number;
  responseData: { result: Record<string, unknown> };
  idToRemove: string;
  pointsTable: Array<{ id: number }>;
  geometriesTable: unknown;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  setSelectedPlan: (plan: FlightPlanType) => void;
  setStep: (step: number) => void;
  setPointsTable: (points: Array<{ id: number }>) => void;
  setGeometriesTable: (geometries: unknown) => void;
  setPoints: (points: FlightPlanType["points"]) => void;
}) {
  const remaining = input.selectedPlan.points.filter(
    (point) => point.id !== input.pointIdToRemove
  );

  input.pointsGraphicsLayer?.removeAll();
  input.yellowGraphicsLayer?.removeAll();

  input.setSelectedPlan({
    ...mergeFlightPlanPersistenceFields(
      input.selectedPlan,
      input.responseData.result as Partial<FlightPlanType>
    ),
    points: remaining,
    pointsObjects: remaining,
  });

  input.setStep(2);
  input.setPointsTable(
    input.pointsTable.filter((point) => point.id !== parseFloat(input.idToRemove))
  );
  input.setGeometriesTable(input.geometriesTable);
  input.setPoints(remaining);
  input.pointsGraphicsLayer?.addMany(buildRemainingPlanPointGraphics(remaining));
}
