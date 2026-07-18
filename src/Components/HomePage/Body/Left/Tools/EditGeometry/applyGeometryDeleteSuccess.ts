import type { Geometry } from "hooks/features/useGeometriesStore";
import { geometryDisplayName } from "./EditForm/helpers/labels";

export function applyGeometryDeleteSuccess(input: {
  selectedGeometry: Geometry;
  dbGeometries: Geometry[];
  setGeometries: (g: Geometry[]) => void;
  setDbGeometries: (g: Geometry[]) => void;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  mapView: __esri.MapView | null | undefined;
  setShowConfirmModal: (v: boolean) => void;
  setSelectedGeometry: (g: Geometry | null) => void;
  logAction: (entry: {
    message: string;
    step: string;
    newData: Record<string, unknown>;
  }) => void;
}) {
  const updated = input.dbGeometries.filter(
    (g) => g.id !== input.selectedGeometry.id
  );
  input.setGeometries(updated);
  input.setDbGeometries(updated);
  input.geometriesGraphicsLayer?.removeAll();
  input.yellowGraphicsLayer?.graphics.removeAll();
  input.mapView?.graphics.removeAll();
  input.setShowConfirmModal(false);
  input.setSelectedGeometry(null);
  input.logAction({
    message: "User deleted a geometry",
    step: "Edit Geometry",
    newData: { geometry: geometryDisplayName(input.selectedGeometry) },
  });
}
