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

function resolveParentChecked(
  controlled: boolean | undefined,
  internal: boolean
): boolean {
  return controlled ?? internal;
}

function resolveParentSetter(
  onChange: ((checked: boolean) => void) | undefined,
  internalSetter: (checked: boolean) => void
): (checked: boolean) => void {
  return onChange ?? internalSetter;
}

function resolveParentGate(
  parentTitle: string | undefined,
  parentChecked: boolean,
  externalParentChecked: boolean | undefined
): { gatedByParent: boolean; parentGateChecked: boolean | undefined } {
  const gatedByParent =
    parentTitle != null || externalParentChecked !== undefined;
  const parentGateChecked = parentTitle ? parentChecked : externalParentChecked;
  return { gatedByParent, parentGateChecked };
}

function buildUseLegendLayersOptions(input: {
  gatedByParent: boolean;
  parentGateChecked: boolean | undefined;
  nestedParentTitle?: string;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
  syncFromSelectedLayers: boolean;
  setParentChecked: (checked: boolean) => void;
}) {
  return {
    externalParentChecked: input.gatedByParent
      ? input.parentGateChecked
      : undefined,
    nestedParentChecked: input.nestedParentTitle
      ? input.nestedParentChecked
      : undefined,
    onExternalParentUnchecked: input.nestedParentTitle
      ? () => input.setNestedParentChecked(false)
      : undefined,
    syncFromSelectedLayers: input.syncFromSelectedLayers,
    onSyncFromSelectedLayers: input.syncFromSelectedLayers
      ? () => input.setParentChecked(true)
      : undefined,
  };
}

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

  const parentChecked = resolveParentChecked(
    controlledParentChecked,
    internalParentChecked
  );
  const setParentChecked = resolveParentSetter(
    onParentCheckedChange,
    setInternalParentChecked
  );

  const { gatedByParent, parentGateChecked } = resolveParentGate(
    parentTitle,
    parentChecked,
    externalParentChecked
  );

  const {
    filteredLayers,
    handleLayerChange,
    isVisibleForRole,
  } = useLegendLayers(
    initialLayers,
    buildUseLegendLayersOptions({
      gatedByParent,
      parentGateChecked,
      nestedParentTitle,
      nestedParentChecked,
      setNestedParentChecked,
      syncFromSelectedLayers,
      setParentChecked,
    })
  );

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
