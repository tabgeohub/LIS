import { useState } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { useLegendLayers } from "../helpers/useLegendLayers";
import {
  toLegendSectionLayoutProps,
  type LegendSectionLayoutProps,
  type LegendSectionLayoutSource,
} from "./legendSectionLayoutProps";

export type { LegendSectionLayoutProps };
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

function useLegendSectionParentState(input: {
  controlledParentChecked: boolean | undefined;
  onParentCheckedChange: ((checked: boolean) => void) | undefined;
}) {
  const [internalParentChecked, setInternalParentChecked] = useState(false);
  return {
    parentChecked: resolveParentChecked(
      input.controlledParentChecked,
      internalParentChecked
    ),
    setParentChecked: resolveParentSetter(
      input.onParentCheckedChange,
      setInternalParentChecked
    ),
  };
}

function buildLayoutSource(input: {
  props: LegendSectionProps;
  parentChecked: boolean;
  setParentChecked: (checked: boolean) => void;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
  layers: ReturnType<typeof useLegendLayers>;
}): LegendSectionLayoutSource {
  return {
    filteredLayers: input.layers.filteredLayers,
    handleLayerChange: input.layers.handleLayerChange,
    isVisibleForRole: input.layers.isVisibleForRole,
    parentTitle: input.props.parentTitle,
    parentChecked: input.parentChecked,
    setParentChecked: input.setParentChecked,
    externalParentChecked: input.props.externalParentChecked,
    nestedParentTitle: input.props.nestedParentTitle,
    nestedParentChecked: input.nestedParentChecked,
    setNestedParentChecked: input.setNestedParentChecked,
    gateNestedByRole: coalesceFalse(input.props.gateNestedByRole),
  };
}

function coalesceFalse(value: boolean | undefined): boolean {
  return value ?? false;
}

function useLegendSectionLayers(input: {
  props: LegendSectionProps;
  parentChecked: boolean;
  setParentChecked: (checked: boolean) => void;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
}) {
  const { gatedByParent, parentGateChecked } = resolveParentGate(
    input.props.parentTitle,
    input.parentChecked,
    input.props.externalParentChecked
  );
  return useLegendLayers(
    input.props.initialLayers,
    buildUseLegendLayersOptions({
      gatedByParent,
      parentGateChecked,
      nestedParentTitle: input.props.nestedParentTitle,
      nestedParentChecked: input.nestedParentChecked,
      setNestedParentChecked: input.setNestedParentChecked,
      syncFromSelectedLayers: coalesceFalse(input.props.syncFromSelectedLayers),
      setParentChecked: input.setParentChecked,
    })
  );
}

function shouldHideLegendSection(
  hideWhenEmpty: boolean | undefined,
  filteredCount: number
): boolean {
  return (hideWhenEmpty ?? false) && filteredCount === 0;
}

export function useLegendSectionModel(props: LegendSectionProps) {
  const { parentChecked, setParentChecked } = useLegendSectionParentState({
    controlledParentChecked: props.parentChecked,
    onParentCheckedChange: props.onParentCheckedChange,
  });
  const [nestedParentChecked, setNestedParentChecked] = useState(false);
  const layers = useLegendSectionLayers({
    props,
    parentChecked,
    setParentChecked,
    nestedParentChecked,
    setNestedParentChecked,
  });
  return {
    hidden: shouldHideLegendSection(
      props.hideWhenEmpty,
      layers.filteredLayers.length
    ),
    layoutProps: toLegendSectionLayoutProps(
      buildLayoutSource({
        props,
        parentChecked,
        setParentChecked,
        nestedParentChecked,
        setNestedParentChecked,
        layers,
      })
    ),
  };
}
