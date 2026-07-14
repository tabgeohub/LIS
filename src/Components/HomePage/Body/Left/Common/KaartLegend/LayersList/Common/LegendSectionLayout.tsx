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
  const childDisabled =
    (parentTitle != null || externalParentChecked !== undefined) &&
    (parentTitle ? !parentChecked : externalParentChecked === false);
  const layerDisabled = childDisabled || Boolean(nestedParentTitle && !nestedParentChecked);

  const layerList = layers.map((layer) => (
    <LayerItem
      key={layer.id}
      layer={layer}
      onLayerChange={handleLayerChange}
      isDisabled={layerDisabled}
    />
  ));

  const showNestedParent =
    Boolean(nestedParentTitle) && (!gateNestedByRole || isVisibleForRole);
  const nestedContent = showNestedParent ? (
    <ParentItem
      title={nestedParentTitle!}
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

  return nestedParentTitle ? <>{nestedContent}</> : <div>{nestedContent}</div>;
}
