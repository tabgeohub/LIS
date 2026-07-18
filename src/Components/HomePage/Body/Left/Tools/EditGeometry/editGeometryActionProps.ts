import type { Geometry } from "hooks/features/useGeometriesStore";

/** Shared action props for ActionButtons / SingleGeometry. */
export type EditGeometryActionProps = {
  geometry: Geometry;
  onEditClick: (geometry: Geometry) => void;
  onDeleteClick: (geometry: Geometry) => void;
};
