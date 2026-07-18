import { useMemo, useEffect } from "react";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useDeleteData } from "utils/useDeleteData";
import { useUpdateData } from "utils/useUpdateData";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import useGeometryListHover from "hooks/hover-click-handlers/useGeometryListHover";
import useGeometryEditHighlight from "hooks/hover-click-handlers/useGeometryEditHighlight";
import { filterGeometriesByTerm } from "./editGeometryHelpers";
import { useEditGeometryUiState } from "./useEditGeometryUiState";

export function useEditGeometryModel() {
  const { dbGeometries, fetchGeometries, setGeometries, setDbGeometries } =
    useGeometriesStore();
  const { user } = useAuth();
  const map = useMapViewState();
  const { handleRemoveHoveredGeometry } = useGeometryListHover();
  const highlight = useGeometryEditHighlight();
  const ui = useEditGeometryUiState();
  const logAction = useLogAction();
  const { deleteData, loading: isDeletingGeometry } = useDeleteData(`/geometries`);
  const { update: updateGeometry, loading: isUpdatingGeometry } = useUpdateData(
    `/geometries/${ui.editingGeometry?.id ?? 0}`
  );

  useEffect(() => {
    map.pointsGraphicsLayer?.removeAll();
  }, [map.pointsGraphicsLayer]);

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role, fetchGeometries]);

  const filteredGeometries = useMemo(
    () => filterGeometriesByTerm(dbGeometries, ui.filterTerm),
    [dbGeometries, ui.filterTerm]
  );

  return {
    dbGeometries,
    setGeometries,
    setDbGeometries,
    map,
    handleRemoveHoveredGeometry,
    highlight,
    ...ui,
    logAction,
    deleteData,
    isDeletingGeometry,
    updateGeometry,
    isUpdatingGeometry,
    filteredGeometries,
  };
}
