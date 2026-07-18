import { ReactNode } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { LayerItem } from "./LayerItem";
import { ParentItem } from "./ParentItem";

export type LegendSectionLayoutProps = {
  layers: LegendLayerDefinition[];
  handleLayerChange: (id: string, checked: boolean) => void;
  parentTitle?: string;
  parentChecked: boolean;
  setParentChecked: (checked: boolean) => void;
  externalParentChecked?: boolean;
  nestedParentTitle?: string;
  nestedParentChecked: boolean;
  setNestedParentChecked: (checked: boolean) => void;
  gateNestedByRole: boolean;
  isVisibleForRole: boolean;
};

function isLegendChildDisabled(
  parentTitle: string | undefined,
  parentChecked: boolean,
  externalParentChecked: boolean | undefined
): boolean {
  const hasParentGate =
    parentTitle != null || externalParentChecked !== undefined;
  if (!hasParentGate) return false;
  return parentTitle ? !parentChecked : externalParentChecked === false;
}

function isLegendLayerDisabled(
  childDisabled: boolean,
  nestedParentTitle: string | undefined,
  nestedParentChecked: boolean
): boolean {
  return childDisabled || Boolean(nestedParentTitle && !nestedParentChecked);
}

function shouldShowNestedParent(
  nestedParentTitle: string | undefined,
  gateNestedByRole: boolean,
  isVisibleForRole: boolean
): boolean {
  return Boolean(nestedParentTitle) && (!gateNestedByRole || isVisibleForRole);
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

function wrapLegendContent(
  nestedParentTitle: string | undefined,
  nestedContent: ReactNode
): ReactNode {
  return nestedParentTitle ? <>{nestedContent}</> : <div>{nestedContent}</div>;
}

function buildLegendLayerList(
  layers: LegendLayerDefinition[],
  handleLayerChange: (id: string, checked: boolean) => void,
  layerDisabled: boolean
): ReactNode {
  return layers.map((layer) => (
    <LayerItem
      key={layer.id}
      layer={layer}
      onLayerChange={handleLayerChange}
      isDisabled={layerDisabled}
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
  const childDisabled = isLegendChildDisabled(
    input.parentTitle,
    input.parentChecked,
    input.externalParentChecked
  );
  return isLegendLayerDisabled(
    childDisabled,
    input.nestedParentTitle,
    input.nestedParentChecked
  );
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
  return wrapLegendContent(input.nestedParentTitle, input.nestedContent);
}

export function LegendSectionLayoutView(props: LegendSectionLayoutProps) {
  const layerDisabled = resolveLegendDisabledState(props);
  const layerList = buildLegendLayerList(
    props.layers,
    props.handleLayerChange,
    layerDisabled
  );
  const nestedContent = renderNestedLegendContent({
    showNestedParent: shouldShowNestedParent(
      props.nestedParentTitle,
      props.gateNestedByRole,
      props.isVisibleForRole
    ),
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
