import { useState } from "react";
import { LayerItem } from "./LayerItem";
import { ParentItem } from "./ParentItem";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { useLegendLayers } from "../helpers/useLegendLayers";

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

function LayerItemsList({
  layers,
  handleLayerChange,
  isDisabled = false,
}: {
  layers: LegendLayerDefinition[];
  handleLayerChange: (id: string, checked: boolean) => void;
  isDisabled?: boolean;
}) {
  return (
    <>
      {layers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          onLayerChange={handleLayerChange}
          isDisabled={isDisabled}
        />
      ))}
    </>
  );
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

  const childDisabled = gatedByParent && parentGateChecked === false;

  const nestedDisabled =
    childDisabled || (nestedParentTitle ? !nestedParentChecked : false);

  const layerList = (
    <LayerItemsList
      layers={filteredLayers}
      handleLayerChange={handleLayerChange}
      isDisabled={nestedParentTitle ? nestedDisabled : childDisabled}
    />
  );

  const nestedContent =
    nestedParentTitle && (!gateNestedByRole || isVisibleForRole) ? (
      <ParentItem
        title={nestedParentTitle}
        checked={nestedParentChecked}
        setChecked={setNestedParentChecked}
        isDisabled={externalParentChecked === false}
      >
        <div className="pl-8">{layerList}</div>
      </ParentItem>
    ) : (
      layerList
    );

  if (parentTitle) {
    return (
      <ParentItem
        title={parentTitle}
        checked={parentChecked}
        setChecked={setParentChecked}
      >
        <div className="pl-8">{nestedContent}</div>
      </ParentItem>
    );
  }

  if (nestedParentTitle) {
    return <>{nestedContent}</>;
  }

  return <div>{nestedContent}</div>;
}
