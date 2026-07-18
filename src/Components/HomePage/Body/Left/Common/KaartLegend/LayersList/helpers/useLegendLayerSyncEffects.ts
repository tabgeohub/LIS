/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect } from "react";
import { LegendLayerDefinition } from "./layerTypes";

type SyncOptions = {
  externalParentChecked?: boolean;
  nestedParentChecked?: boolean;
  onExternalParentUnchecked?: () => void;
  syncFromSelectedLayers?: boolean;
  onSyncFromSelectedLayers?: () => void;
};

export function useLegendLayerSyncEffects(
  setLayers: Dispatch<SetStateAction<LegendLayerDefinition[]>>,
  selectedLayers: string[],
  options: SyncOptions
) {
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
}
