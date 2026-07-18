import { ReactNode } from "react";
import { LegendLayerDefinition } from "../helpers/layerTypes";
import { LayerItem } from "./LayerItem";
import { ParentItem } from "./ParentItem";

type LegendSectionLayoutProps = {
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

export default function LegendSectionLayout({
  layers,
  handleLayerChange,
  parentTitle,
  parentChecked,
  setParentChecked,
  externalParentChecked,
  nestedParentTitle,
  nestedParentChecked,
  setNestedParentChecked,
  gateNestedByRole,
  isVisibleForRole,
}: LegendSectionLayoutProps) {
  const childDisabled = isLegendChildDisabled(
    parentTitle,
    parentChecked,
    externalParentChecked
  );
  const layerDisabled = isLegendLayerDisabled(
    childDisabled,
    nestedParentTitle,
    nestedParentChecked
  );

  const layerList = layers.map((layer) => (
    <LayerItem
      key={layer.id}
      layer={layer}
      onLayerChange={handleLayerChange}
      isDisabled={layerDisabled}
    />
  ));

  const showNestedParent = shouldShowNestedParent(
    nestedParentTitle,
    gateNestedByRole,
    isVisibleForRole
  );
  const nestedContent = renderNestedLegendContent({
    showNestedParent,
    nestedParentTitle,
    nestedParentChecked,
    setNestedParentChecked,
    externalParentChecked,
    layerList,
  });

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

  return wrapLegendContent(nestedParentTitle, nestedContent);
}
