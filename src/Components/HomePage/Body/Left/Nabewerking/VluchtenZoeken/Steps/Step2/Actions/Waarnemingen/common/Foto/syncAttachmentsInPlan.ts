import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedGeometryType,
  FinishedPointType,
} from "Types/finished_plans";

export function syncPointAttachmentsInPlan(input: {
  selectedPlan: FinishedFlightPlanType;
  selectedPoint: FinishedPointType;
  newAttachments: AttachmentType[];
}): {
  updatedPlan: FinishedFlightPlanType;
  updatedPoint: FinishedPointType;
} {
  const updatedPoint: FinishedPointType = {
    ...input.selectedPoint,
    attachments: input.newAttachments,
  };

  const updatedPlan: FinishedFlightPlanType = {
    ...input.selectedPlan,
    points_data: input.selectedPlan.points_data.map((point) =>
      point.id === input.selectedPoint.id ? updatedPoint : point
    ),
  };

  return { updatedPlan, updatedPoint };
}

export function syncGeometryAttachmentsInPlan(input: {
  selectedPlan: FinishedFlightPlanType;
  selectedGeometry: FinishedGeometryType;
  pointId: number;
  newAttachments: AttachmentType[];
}): {
  updatedPlan: FinishedFlightPlanType;
  updatedGeometry: FinishedGeometryType;
} {
  const existingPoint = input.selectedGeometry.points.find(
    (point) => point.id === input.pointId
  );
  if (!existingPoint) {
    return {
      updatedPlan: input.selectedPlan,
      updatedGeometry: input.selectedGeometry,
    };
  }

  const updatedPoint: FinishedPointType = {
    ...existingPoint,
    attachments: input.newAttachments,
  };

  const updatedPoints = input.selectedGeometry.points.map((point) =>
    point.id === input.pointId ? updatedPoint : point
  );

  const updatedGeometry: FinishedGeometryType = {
    ...input.selectedGeometry,
    points: updatedPoints,
  };

  const updatedPlan: FinishedFlightPlanType = {
    ...input.selectedPlan,
    geometries: input.selectedPlan.geometries.map((geom) =>
      geom.id === input.selectedGeometry.id ? updatedGeometry : geom
    ),
    points_data: input.selectedPlan.points_data.map((point) =>
      point.id === input.pointId ? updatedPoint : point
    ),
  };

  return { updatedPlan, updatedGeometry };
}
