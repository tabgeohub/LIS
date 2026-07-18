import type { Geometry } from "hooks/features/useGeometriesStore";
import type { GeometryEditDraft, GeometryPointRow } from "./EditForm";
import {
  applyEditGeometryPointUpdate,
  deleteSelectedGeometry,
  openEditGeometry,
  saveEditGeometry,
} from "./editGeometryActionHandlers";
import { logDeleteGeometryClick } from "./EditGeometryListView";
import type { useEditGeometryModel } from "./useEditGeometryModel";

type Model = ReturnType<typeof useEditGeometryModel>;

export function makeEditClickHandler(m: Model) {
  return (geometry: Geometry) =>
    openEditGeometry({
      geometry,
      handleRemoveHoveredGeometry: m.handleRemoveHoveredGeometry,
      addEditGeometryHighlight: m.highlight.addEditGeometryHighlight,
      setEditingGeometry: m.setEditingGeometry,
      mapView: m.map.mapView,
      logAction: m.logAction,
    });
}

export function makeEditSaveHandler(m: Model) {
  return (draft: GeometryEditDraft, points?: GeometryPointRow[]) =>
    saveEditGeometry({
      editingGeometry: m.editingGeometry,
      draft,
      points,
      updateGeometry: m.updateGeometry,
      dbGeometries: m.dbGeometries,
      setGeometries: m.setGeometries,
      setDbGeometries: m.setDbGeometries,
      removeEditGeometryHighlight: m.highlight.removeEditGeometryHighlight,
      setEditingGeometry: m.setEditingGeometry,
      logAction: m.logAction,
    });
}

export function makePointUpdatedHandler(m: Model) {
  return (updatedPoint: GeometryPointRow, allPoints: GeometryPointRow[]) =>
    applyEditGeometryPointUpdate({
      editingGeometry: m.editingGeometry,
      updatedPoint,
      allPoints,
      setEditingGeometry: m.setEditingGeometry,
      addEditGeometryHighlight: m.highlight.addEditGeometryHighlight,
      dbGeometries: m.dbGeometries,
      setGeometries: m.setGeometries,
      setDbGeometries: m.setDbGeometries,
    });
}

export function makeDeleteHandler(m: Model) {
  return () =>
    deleteSelectedGeometry({
      selectedGeometry: m.selectedGeometry,
      setIsDeleting: m.setIsDeleting,
      deleteData: m.deleteData,
      dbGeometries: m.dbGeometries,
      setGeometries: m.setGeometries,
      setDbGeometries: m.setDbGeometries,
      geometriesGraphicsLayer: m.map.geometriesGraphicsLayer,
      yellowGraphicsLayer: m.map.yellowGraphicsLayer,
      mapView: m.map.mapView,
      setShowConfirmModal: m.setShowConfirmModal,
      setSelectedGeometry: m.setSelectedGeometry,
      logAction: m.logAction,
    });
}

export function makeDeleteClickHandler(m: Model) {
  return (geometry: Geometry) => {
    m.setSelectedGeometry(geometry);
    m.setShowConfirmModal(true);
    logDeleteGeometryClick(geometry, m.logAction);
  };
}
