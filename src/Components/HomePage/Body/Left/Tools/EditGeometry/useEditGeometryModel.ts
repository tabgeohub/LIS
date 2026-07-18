import { useMemo } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import useGeometryListHover from "hooks/hover-click-handlers/useGeometryListHover";
import useGeometryEditHighlight from "hooks/hover-click-handlers/useGeometryEditHighlight";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { filterGeometriesByTerm } from "./editGeometryHelpers";
import { useEditGeometryUiState } from "./useEditGeometryUiState";
import { useEditGeometryMutations } from "./useEditGeometryMutations";
import { useEditGeometryModelEffects } from "./useEditGeometryModelEffects";

export function useEditGeometryModel() {
  const s = useGeometriesStore();
  const { user } = useAuth();
  const map = useMapViewState();
  const { handleRemoveHoveredGeometry } = useGeometryListHover();
  const highlight = useGeometryEditHighlight();
  const ui = useEditGeometryUiState();
  const logAction = useLogAction();
  const mutations = useEditGeometryMutations(ui.editingGeometry?.id ?? 0);
  useEditGeometryModelEffects({ map, user, fetchGeometries: s.fetchGeometries });
  const filteredGeometries = useMemo(
    () => filterGeometriesByTerm(s.dbGeometries, ui.filterTerm),
    [s.dbGeometries, ui.filterTerm]
  );
  return {
    dbGeometries: s.dbGeometries,
    setGeometries: s.setGeometries,
    setDbGeometries: s.setDbGeometries,
    map,
    handleRemoveHoveredGeometry,
    highlight,
    ...ui,
    logAction,
    ...mutations,
    filteredGeometries,
  };
}
