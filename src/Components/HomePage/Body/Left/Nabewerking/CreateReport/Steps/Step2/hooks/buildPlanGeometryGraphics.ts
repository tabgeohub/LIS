import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { FinishedFlightPlanType } from "Types/finished_plans";

const YELLOW_SYMBOL = {
  fillColor: [0, 0, 0, 0] as [number, number, number, number],
  outlineColor: [255, 255, 0, 1] as [number, number, number, number],
  lineColor: [255, 255, 0, 1] as [number, number, number, number],
  outlineWidth: 3,
  lineWidth: 4,
};

function toGeometryInput(geometry: NonNullable<FinishedFlightPlanType["geometries"]>[number]) {
  return {
    id: geometry.id,
    geometry_type: (geometry.geometry_type as "polygon" | "line") || undefined,
    geometry_omschrijving: geometry.geometry_omschrijving || undefined,
    points: geometry.points,
  };
}

export function buildPlanGeometryGraphics(
  selectedPlan: FinishedFlightPlanType,
  selectedGeometries: number[]
): Graphic[] {
  const graphics: Graphic[] = [];

  selectedPlan.geometries?.forEach((geometry) => {
    if (!geometry.points?.length) return;

    const graphic = createGeometryGraphic(toGeometryInput(geometry), {
      attributes: {
        geometryId: geometry.id,
        geometryType: geometry.geometry_type,
        omschrijving: geometry.geometry_omschrijving,
        type: "geometry",
      },
    });

    if (graphic) graphics.push(graphic);
  });

  if (selectedGeometries.length === 0) return graphics;

  selectedPlan.geometries
    ?.filter((geometry) => selectedGeometries.includes(geometry.id))
    .forEach((geometry) => {
      if (!geometry.points?.length) return;

      const graphic = createGeometryGraphic(toGeometryInput(geometry), {
        symbolOptions: YELLOW_SYMBOL,
        attributes: { ...geometry, isSelected: true },
      });

      if (graphic) graphics.push(graphic);
    });

  return graphics;
}
