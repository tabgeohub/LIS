import { LegendLayerDefinition } from "../helpers/layerTypes";

/** Shared layout fields used by LegendSection model → layout mapping. */
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

export type LegendSectionLayoutSource = {
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
};

export function toLegendSectionLayoutProps(
  input: LegendSectionLayoutSource
): LegendSectionLayoutProps {
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
