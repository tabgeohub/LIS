/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "hooks/zustand/ui";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useMemo, useState } from "react";
import { LegendLayerDefinition } from "./layerTypes";
import { useHandleLayerChange } from "./useHandleLayerChange";
import {
  filterLayersByRegio,
  getUniqueRegioCodes,
} from "./legendLayerFilters";
import { useLegendLayerSyncEffects } from "./useLegendLayerSyncEffects";

export { filterLayersByRegio, getUniqueRegioCodes } from "./legendLayerFilters";

type UseLegendLayersOptions = {
  externalParentChecked?: boolean;
  nestedParentChecked?: boolean;
  onExternalParentUnchecked?: () => void;
  syncFromSelectedLayers?: boolean;
  onSyncFromSelectedLayers?: () => void;
};

export function useLegendLayers(
  initialLayers: LegendLayerDefinition[],
  options: UseLegendLayersOptions = {}
) {
  const { user } = useAuth();
  const { selectedLayers } = kaartlagenState();
  const [layers, setLayers] = useState(initialLayers);
  const handleLayerChange = useHandleLayerChange(setLayers);
  const filteredLayers = useMemo(
    () => filterLayersByRegio(layers, user.role),
    [layers, user.role]
  );
  const uniqueRegioCodes = useMemo(() => getUniqueRegioCodes(layers), [layers]);
  useLegendLayerSyncEffects({ setLayers, selectedLayers, options });
  const isVisibleForRole =
    user.role === "admin" ||
    uniqueRegioCodes.some((role) => role === user.role);
  return {
    layers,
    setLayers,
    filteredLayers,
    handleLayerChange,
    uniqueRegioCodes,
    isVisibleForRole,
    userRole: user.role,
  };
}
