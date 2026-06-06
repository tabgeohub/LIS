import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedGeometryType,
  FinishedPointType,
} from "Types/finished_plans";

export function syncPointAttachmentsInPlan(
  selectedPlan: FinishedFlightPlanType,
  selectedPoint: FinishedPointType,
  newAttachments: AttachmentType[]
): {
  updatedPlan: FinishedFlightPlanType;
  updatedPoint: FinishedPointType;
} {
  const updatedPoint: FinishedPointType = {
    ...selectedPoint,
    attachments: newAttachments,
  };

  const updatedPlan: FinishedFlightPlanType = {
    ...selectedPlan,
    points_data: selectedPlan.points_data.map((point) =>
      point.id === selectedPoint.id ? updatedPoint : point
    ),
  };

  return { updatedPlan, updatedPoint };
}

export function syncGeometryAttachmentsInPlan(
  selectedPlan: FinishedFlightPlanType,
  selectedGeometry: FinishedGeometryType,
  pointId: number,
  newAttachments: AttachmentType[]
): {
  updatedPlan: FinishedFlightPlanType;
  updatedGeometry: FinishedGeometryType;
} {
  const existingPoint = selectedGeometry.points.find(
    (point) => point.id === pointId
  );
  if (!existingPoint) {
    return { updatedPlan: selectedPlan, updatedGeometry: selectedGeometry };
  }

  const updatedPoint: FinishedPointType = {
    ...existingPoint,
    attachments: newAttachments,
  };

  const updatedPoints = selectedGeometry.points.map((point) =>
    point.id === pointId ? updatedPoint : point
  );

  const updatedGeometry: FinishedGeometryType = {
    ...selectedGeometry,
    points: updatedPoints,
  };

  const updatedPlan: FinishedFlightPlanType = {
    ...selectedPlan,
    geometries: selectedPlan.geometries.map((geom) =>
      geom.id === selectedGeometry.id ? updatedGeometry : geom
    ),
    points_data: selectedPlan.points_data.map((point) =>
      point.id === pointId ? updatedPoint : point
    ),
  };

  return { updatedPlan, updatedGeometry };
}
