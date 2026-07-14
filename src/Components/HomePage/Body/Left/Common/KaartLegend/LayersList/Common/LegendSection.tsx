import { useState } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { useLegendLayers } from "../helpers/useLegendLayers";
import LegendSectionLayout from "./LegendSectionLayout";

type LegendSectionProps = {
  initialLayers: LegendLayerDefinition[];
  /** Wrap children in a ParentItem with its own checkbox (Block1/Section2, NNederland). */
  parentTitle?: string;
  parentChecked?: boolean;
  onParentCheckedChange?: (checked: boolean) => void;
  /** Disable layer toggles when an ancestor parent is unchecked (Overig sub-sections). */
  externalParentChecked?: boolean;
  /** Nested group inside external parent (Overig Section1/3 — e.g. "Wegen"). */
  nestedParentTitle?: string;
  /** Hide nested group unless admin or role matches unique regio codes (Overig Section1/3). */
  gateNestedByRole?: boolean;
  /** Hide the whole section when no layers match the user's regio. */
  hideWhenEmpty?: boolean;
  /** Restore checked state from kaartlagenState.selectedLayers (NNederland). */
  syncFromSelectedLayers?: boolean;
};

export default function LegendSection({
  initialLayers,
  parentTitle,
  parentChecked: controlledParentChecked,
  onParentCheckedChange,
  externalParentChecked,
  nestedParentTitle,
  gateNestedByRole = false,
  hideWhenEmpty = false,
  syncFromSelectedLayers = false,
}: LegendSectionProps) {
  const [internalParentChecked, setInternalParentChecked] = useState(false);
  const [nestedParentChecked, setNestedParentChecked] = useState(false);

  const parentChecked = controlledParentChecked ?? internalParentChecked;
  const setParentChecked = onParentCheckedChange ?? setInternalParentChecked;

  const gatedByParent = parentTitle != null || externalParentChecked !== undefined;
  const parentGateChecked = parentTitle ? parentChecked : externalParentChecked;

  const {
    filteredLayers,
    handleLayerChange,
    isVisibleForRole,
  } = useLegendLayers(initialLayers, {
    externalParentChecked: gatedByParent ? parentGateChecked : undefined,
    nestedParentChecked: nestedParentTitle ? nestedParentChecked : undefined,
    onExternalParentUnchecked: nestedParentTitle
      ? () => setNestedParentChecked(false)
      : undefined,
    syncFromSelectedLayers,
    onSyncFromSelectedLayers: syncFromSelectedLayers
      ? () => setParentChecked(true)
      : undefined,
  });

  if (hideWhenEmpty && filteredLayers.length === 0) {
    return null;
  }

  return (
    <LegendSectionLayout
      layers={filteredLayers}
      handleLayerChange={handleLayerChange}
      parentTitle={parentTitle}
      parentChecked={parentChecked}
      setParentChecked={setParentChecked}
      externalParentChecked={externalParentChecked}
      nestedParentTitle={nestedParentTitle}
      nestedParentChecked={nestedParentChecked}
      setNestedParentChecked={setNestedParentChecked}
      gateNestedByRole={gateNestedByRole}
      isVisibleForRole={isVisibleForRole}
    />
  );
}
