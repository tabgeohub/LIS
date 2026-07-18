import type { Geometry } from "hooks/features/useGeometriesStore";
import { geometryDisplayName } from "./EditForm/helpers/labels";
import type { GeometryEditDraft, GeometryPointRow } from "./EditForm";
import {
  buildGeometrySavePayload,
  patchGeometryPointInList,
  zoomMapToGeometryPoints,
} from "./editGeometryHelpers";
import {
  applyGeometryDeleteSuccess,
  applyGeometrySaveSuccess,
} from "./editGeometrySuccessHandlers";

type LogAction = (input: {
  message: string;
  step: string;
  newData?: Record<string, unknown>;
}) => void;

export type OpenEditGeometryInput = {
  geometry: Geometry;
  handleRemoveHoveredGeometry: () => void;
  addEditGeometryHighlight: (geometry: Geometry) => void;
  setEditingGeometry: (geometry: Geometry) => void;
  mapView: __esri.MapView | null | undefined;
  logAction: LogAction;
};

export function openEditGeometry(input: OpenEditGeometryInput) {
  input.handleRemoveHoveredGeometry();
  input.addEditGeometryHighlight(input.geometry);
  input.setEditingGeometry(input.geometry);
  zoomMapToGeometryPoints(input.mapView, input.geometry);
  input.logAction({
    message: "User opened edit geometry form",
    step: "Edit Geometry",
    newData: {
      geometryId: input.geometry.id,
      omschrijving: geometryDisplayName(input.geometry),
    },
  });
}

export type SaveEditGeometryInput = {
  editingGeometry: Geometry | null;
  draft: GeometryEditDraft;
  points: GeometryPointRow[] | undefined;
  updateGeometry: (args: {
    data: ReturnType<typeof buildGeometrySavePayload>;
    onSuccess: (responseData: {
      result?: Partial<Geometry> & { points?: Geometry["points"] };
    }) => void;
  }) => void;
  dbGeometries: Geometry[];
  setGeometries: (geometries: Geometry[]) => void;
  setDbGeometries: (geometries: Geometry[]) => void;
  removeEditGeometryHighlight: () => void;
  setEditingGeometry: (geometry: Geometry | null) => void;
  logAction: LogAction;
};

export function saveEditGeometry(input: SaveEditGeometryInput) {
  if (!input.editingGeometry) return;
  const payload = buildGeometrySavePayload({
    editingGeometry: input.editingGeometry,
    draft: input.draft,
    points: input.points,
  });
  input.updateGeometry({
    data: payload,
    onSuccess: (responseData) =>
      applyGeometrySaveSuccess({
        editingGeometry: input.editingGeometry!,
        payload,
        responseData,
        dbGeometries: input.dbGeometries,
        setGeometries: input.setGeometries,
        setDbGeometries: input.setDbGeometries,
        removeEditGeometryHighlight: input.removeEditGeometryHighlight,
        setEditingGeometry: input.setEditingGeometry,
        logAction: input.logAction,
      }),
  });
}

export type PointUpdateInput = {
  editingGeometry: Geometry | null;
  updatedPoint: GeometryPointRow;
  allPoints: GeometryPointRow[];
  setEditingGeometry: (geometry: Geometry) => void;
  addEditGeometryHighlight: (geometry: Geometry) => void;
  dbGeometries: Geometry[];
  setGeometries: (geometries: Geometry[]) => void;
  setDbGeometries: (geometries: Geometry[]) => void;
};

export function applyEditGeometryPointUpdate(input: PointUpdateInput) {
  if (!input.editingGeometry) return;
  const updatedGeometry: Geometry = {
    ...input.editingGeometry,
    points: input.allPoints,
  };
  input.setEditingGeometry(updatedGeometry);
  input.addEditGeometryHighlight(updatedGeometry);
  const patch = (geometries: Geometry[]) =>
    patchGeometryPointInList({
      geometries,
      geometryId: updatedGeometry.id,
      updatedPoint: input.updatedPoint,
    });
  input.setGeometries(patch(input.dbGeometries));
  input.setDbGeometries(patch(input.dbGeometries));
}

export type DeleteSelectedGeometryInput = {
  selectedGeometry: Geometry | null;
  setIsDeleting: (value: boolean) => void;
  deleteData: (args: { id: number; onSuccess: () => void }) => Promise<void>;
  dbGeometries: Geometry[];
  setGeometries: (geometries: Geometry[]) => void;
  setDbGeometries: (geometries: Geometry[]) => void;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  mapView: __esri.MapView | null | undefined;
  setShowConfirmModal: (value: boolean) => void;
  setSelectedGeometry: (geometry: Geometry | null) => void;
  logAction: LogAction;
};

export async function deleteSelectedGeometry(
  input: DeleteSelectedGeometryInput
) {
  if (!input.selectedGeometry) return;
  input.setIsDeleting(true);
  try {
    await input.deleteData({
      id: input.selectedGeometry.id,
      onSuccess: () =>
        applyGeometryDeleteSuccess({
          selectedGeometry: input.selectedGeometry!,
          dbGeometries: input.dbGeometries,
          setGeometries: input.setGeometries,
          setDbGeometries: input.setDbGeometries,
          geometriesGraphicsLayer: input.geometriesGraphicsLayer,
          yellowGraphicsLayer: input.yellowGraphicsLayer,
          mapView: input.mapView,
          setShowConfirmModal: input.setShowConfirmModal,
          setSelectedGeometry: input.setSelectedGeometry,
          logAction: input.logAction,
        }),
    });
  } catch (error) {
    console.error("Error deleting geometry:", error);
  } finally {
    input.setIsDeleting(false);
  }
}
