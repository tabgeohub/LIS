/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect } from "react";
import { LegendLayerDefinition } from "./layerTypes";

export type LegendLayerSyncOptions = {
  externalParentChecked?: boolean;
  nestedParentChecked?: boolean;
  onExternalParentUnchecked?: () => void;
  syncFromSelectedLayers?: boolean;
  onSyncFromSelectedLayers?: () => void;
};

function syncExternalParentUnchecked(input: {
  setLayers: Dispatch<SetStateAction<LegendLayerDefinition[]>>;
  options: LegendLayerSyncOptions;
}) {
  if (input.options.externalParentChecked !== false) return;
  input.options.onExternalParentUnchecked?.();
  input.setLayers((prev) => prev.map((layer) => ({ ...layer, checked: false })));
}

function syncNestedParentUnchecked(input: {
  setLayers: Dispatch<SetStateAction<LegendLayerDefinition[]>>;
  options: LegendLayerSyncOptions;
}) {
  if (input.options.nestedParentChecked !== false) return;
  input.setLayers((prev) => prev.map((layer) => ({ ...layer, checked: false })));
}

function syncSelectedLayerIds(input: {
  setLayers: Dispatch<SetStateAction<LegendLayerDefinition[]>>;
  selectedLayers: string[];
  options: LegendLayerSyncOptions;
}) {
  if (!input.options.syncFromSelectedLayers || input.selectedLayers.length === 0) {
    return;
  }
  input.options.onSyncFromSelectedLayers?.();
  input.setLayers((prev) =>
    prev.map((layer) => ({
      ...layer,
      checked: input.selectedLayers.includes(layer.id),
    }))
  );
}

export function useLegendLayerSyncEffects(
  setLayers: Dispatch<SetStateAction<LegendLayerDefinition[]>>,
  selectedLayers: string[],
  options: LegendLayerSyncOptions
) {
  useEffect(() => {
    syncExternalParentUnchecked({ setLayers, options });
  }, [options.externalParentChecked]);

  useEffect(() => {
    syncNestedParentUnchecked({ setLayers, options });
  }, [options.nestedParentChecked]);

  useEffect(() => {
    syncSelectedLayerIds({ setLayers, selectedLayers, options });
  }, [options.syncFromSelectedLayers, selectedLayers]);
}
