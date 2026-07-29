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

function buildUpdatedGeometryPoint(input: {
  selectedGeometry: FinishedGeometryType;
  pointId: number;
  newAttachments: AttachmentType[];
}): {
  updatedPoint: FinishedPointType;
  updatedGeometry: FinishedGeometryType;
} | null {
  const existingPoint = input.selectedGeometry.points.find(
    (point) => point.id === input.pointId
  );
  if (!existingPoint) return null;

  const updatedPoint: FinishedPointType = {
    ...existingPoint,
    attachments: input.newAttachments,
  };
  return {
    updatedPoint,
    updatedGeometry: {
      ...input.selectedGeometry,
      points: input.selectedGeometry.points.map((point) =>
        point.id === input.pointId ? updatedPoint : point
      ),
    },
  };
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
  const built = buildUpdatedGeometryPoint(input);
  if (!built) {
    return {
      updatedPlan: input.selectedPlan,
      updatedGeometry: input.selectedGeometry,
    };
  }

  const { updatedPoint, updatedGeometry } = built;
  return {
    updatedGeometry,
    updatedPlan: {
      ...input.selectedPlan,
      geometries: input.selectedPlan.geometries.map((geom) =>
        geom.id === input.selectedGeometry.id ? updatedGeometry : geom
      ),
      points_data: input.selectedPlan.points_data.map((point) =>
        point.id === input.pointId ? updatedPoint : point
      ),
    },
  };
}
