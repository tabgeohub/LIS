import { useState } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { useLegendLayers } from "../helpers/useLegendLayers";

export type LegendSectionProps = {
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

function useLegendSectionParentState(
  controlledParentChecked: boolean | undefined,
  onParentCheckedChange: ((checked: boolean) => void) | undefined
) {
  const [internalParentChecked, setInternalParentChecked] = useState(false);
  return {
    parentChecked: resolveParentChecked(
      controlledParentChecked,
      internalParentChecked
    ),
    setParentChecked: resolveParentSetter(
      onParentCheckedChange,
      setInternalParentChecked
    ),
  };
}

function toLegendSectionLayoutProps(input: {
  filteredLayers: LegendLayerDefinition[];
  handleLayerChange: (id: string, checked: boolean) => void;
  isVisibleForRole: boolean;
  parentTitle?: string;
  parentChecked: boolean;
  setParentChecked: (checked: boolean) => void;
  externalParentChecked?: boolean;
  nestedParentTitle?: string;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
  gateNestedByRole: boolean;
}) {
  return {
    layers: input.filteredLayers,
    handleLayerChange: input.handleLayerChange,
    parentTitle: input.parentTitle,
    parentChecked: input.parentChecked,
    setParentChecked: input.setParentChecked,
    externalParentChecked: input.externalParentChecked,
    nestedParentTitle: input.nestedParentTitle,
    nestedParentChecked: input.nestedParentChecked,
    setNestedParentChecked: input.setNestedParentChecked,
    gateNestedByRole: input.gateNestedByRole,
    isVisibleForRole: input.isVisibleForRole,
  };
}

export function useLegendSectionModel(props: LegendSectionProps) {
  const { parentChecked, setParentChecked } = useLegendSectionParentState(
    props.parentChecked,
    props.onParentCheckedChange
  );
  const [nestedParentChecked, setNestedParentChecked] = useState(false);
  const { gatedByParent, parentGateChecked } = resolveParentGate(
    props.parentTitle,
    parentChecked,
    props.externalParentChecked
  );
  const layers = useLegendLayers(
    props.initialLayers,
    buildUseLegendLayersOptions({
      gatedByParent,
      parentGateChecked,
      nestedParentTitle: props.nestedParentTitle,
      nestedParentChecked,
      setNestedParentChecked,
      syncFromSelectedLayers: props.syncFromSelectedLayers ?? false,
      setParentChecked,
    })
  );

  return {
    hidden:
      (props.hideWhenEmpty ?? false) && layers.filteredLayers.length === 0,
    layoutProps: toLegendSectionLayoutProps({
      filteredLayers: layers.filteredLayers,
      handleLayerChange: layers.handleLayerChange,
      isVisibleForRole: layers.isVisibleForRole,
      parentTitle: props.parentTitle,
      parentChecked,
      setParentChecked,
      externalParentChecked: props.externalParentChecked,
      nestedParentTitle: props.nestedParentTitle,
      nestedParentChecked,
      setNestedParentChecked,
      gateNestedByRole: props.gateNestedByRole ?? false,
    }),
  };
}
