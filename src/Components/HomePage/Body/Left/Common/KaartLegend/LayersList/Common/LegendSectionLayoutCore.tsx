import { ReactNode } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { LayerItem } from "./LayerItem";
import { ParentItem } from "./ParentItem";
import type { LegendSectionLayoutProps } from "./legendSectionLayoutProps";

export type { LegendSectionLayoutProps };

function isLegendChildDisabled(input: {
  parentTitle: string | undefined;
  parentChecked: boolean;
  externalParentChecked: boolean | undefined;
}): boolean {
  const hasParentGate =
    input.parentTitle != null || input.externalParentChecked !== undefined;
  if (!hasParentGate) return false;
  return input.parentTitle
    ? !input.parentChecked
    : input.externalParentChecked === false;
}

function isLegendLayerDisabled(input: {
  childDisabled: boolean;
  nestedParentTitle: string | undefined;
  nestedParentChecked: boolean;
}): boolean {
  return (
    input.childDisabled ||
    Boolean(input.nestedParentTitle && !input.nestedParentChecked)
  );
}

function shouldShowNestedParent(input: {
  nestedParentTitle: string | undefined;
  gateNestedByRole: boolean;
  isVisibleForRole: boolean;
}): boolean {
  return (
    Boolean(input.nestedParentTitle) &&
    (!input.gateNestedByRole || input.isVisibleForRole)
  );
}

function renderNestedLegendContent(input: {
  showNestedParent: boolean;
  nestedParentTitle?: string;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
  externalParentChecked?: boolean;
  layerList: ReactNode;
}): ReactNode {
  if (!input.showNestedParent) return input.layerList;
  return (
    <ParentItem
      title={input.nestedParentTitle!}
      checked={input.nestedParentChecked}
      setChecked={input.setNestedParentChecked}
      isDisabled={input.externalParentChecked === false}
    >
      <div className="pl-8">{input.layerList}</div>
    </ParentItem>
  );
}

function wrapLegendContent(input: {
  nestedParentTitle: string | undefined;
  nestedContent: ReactNode;
}): ReactNode {
  return input.nestedParentTitle ? (
    <>{input.nestedContent}</>
  ) : (
    <div>{input.nestedContent}</div>
  );
}

function buildLegendLayerList(input: {
  layers: LegendLayerDefinition[];
  handleLayerChange: (id: string, checked: boolean) => void;
  layerDisabled: boolean;
}): ReactNode {
  return input.layers.map((layer) => (
    <LayerItem
      key={layer.id}
      layer={layer}
      onLayerChange={input.handleLayerChange}
      isDisabled={input.layerDisabled}
    />
  ));
}

function resolveLegendDisabledState(input: {
  parentTitle?: string;
  parentChecked: boolean;
  externalParentChecked?: boolean;
  nestedParentTitle?: string;
  nestedParentChecked: boolean;
}) {
  const childDisabled = isLegendChildDisabled({
    parentTitle: input.parentTitle,
    parentChecked: input.parentChecked,
    externalParentChecked: input.externalParentChecked,
  });
  return isLegendLayerDisabled({
    childDisabled,
    nestedParentTitle: input.nestedParentTitle,
    nestedParentChecked: input.nestedParentChecked,
  });
}

function renderLegendSectionBody(input: {
  parentTitle?: string;
  parentChecked: boolean;
  setParentChecked: (checked: boolean) => void;
  nestedParentTitle?: string;
  nestedContent: ReactNode;
}): ReactNode {
  if (input.parentTitle) {
    return (
      <ParentItem
        title={input.parentTitle}
        checked={input.parentChecked}
        setChecked={input.setParentChecked}
      >
        <div className="pl-8">{input.nestedContent}</div>
      </ParentItem>
    );
  }
  return wrapLegendContent({
    nestedParentTitle: input.nestedParentTitle,
    nestedContent: input.nestedContent,
  });
}

export function LegendSectionLayoutView(props: LegendSectionLayoutProps) {
  const layerDisabled = resolveLegendDisabledState(props);
  const layerList = buildLegendLayerList({
    layers: props.layers,
    handleLayerChange: props.handleLayerChange,
    layerDisabled,
  });
  const nestedContent = renderNestedLegendContent({
    showNestedParent: shouldShowNestedParent({
      nestedParentTitle: props.nestedParentTitle,
      gateNestedByRole: props.gateNestedByRole,
      isVisibleForRole: props.isVisibleForRole,
    }),
    nestedParentTitle: props.nestedParentTitle,
    nestedParentChecked: props.nestedParentChecked,
    setNestedParentChecked: props.setNestedParentChecked,
    externalParentChecked: props.externalParentChecked,
    layerList,
  });
  return renderLegendSectionBody({
    parentTitle: props.parentTitle,
    parentChecked: props.parentChecked,
    setParentChecked: props.setParentChecked,
    nestedParentTitle: props.nestedParentTitle,
    nestedContent,
  });
}
