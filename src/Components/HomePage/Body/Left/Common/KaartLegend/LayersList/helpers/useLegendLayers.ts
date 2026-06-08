/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useEffect, useMemo, useState } from "react";
import { LegendLayerDefinition } from "./layerTypes";
import { useHandleLayerChange } from "./useHandleLayerChange";

function getUserRegioCode(role: string) {
  return role.split(" ")[1];
}

export function filterLayersByRegio(
  layers: LegendLayerDefinition[],
  userRole: string
) {
  if (userRole === "admin") return layers;

  const regioCode = getUserRegioCode(userRole);
  return layers.filter((layer) => layer.regio?.includes(regioCode));
}

export function getUniqueRegioCodes(layers: LegendLayerDefinition[]) {
  return layers
    .map((layer) => layer.regio)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);
}

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

  const uniqueRegioCodes = useMemo(
    () => getUniqueRegioCodes(layers),
    [layers]
  );

  useEffect(() => {
    if (options.externalParentChecked === false) {
      options.onExternalParentUnchecked?.();
      setLayers((prev) => prev.map((layer) => ({ ...layer, checked: false })));
    }
  }, [options.externalParentChecked]);

  useEffect(() => {
    if (options.nestedParentChecked === false) {
      setLayers((prev) => prev.map((layer) => ({ ...layer, checked: false })));
    }
  }, [options.nestedParentChecked]);

  useEffect(() => {
    if (!options.syncFromSelectedLayers || selectedLayers.length === 0) return;

    options.onSyncFromSelectedLayers?.();

    setLayers((prev) =>
      prev.map((layer) => ({
        ...layer,
        checked: selectedLayers.includes(layer.id),
      }))
    );
  }, [options.syncFromSelectedLayers, selectedLayers]);

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
