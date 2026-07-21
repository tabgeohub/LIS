import { LegendLayerDefinition } from "../helpers/layerTypes";

/** Shared layout fields used by LegendSection model → layout mapping. */
type LegendSectionLayoutFields = {
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

export type LegendSectionLayoutProps = LegendSectionLayoutFields & {
  layers: LegendLayerDefinition[];
};

export type LegendSectionLayoutSource = LegendSectionLayoutFields & {
  filteredLayers: LegendLayerDefinition[];
};

export function toLegendSectionLayoutProps(
  input: LegendSectionLayoutSource
): LegendSectionLayoutProps {
  const { filteredLayers, ...fields } = input;
  return { ...fields, layers: filteredLayers };
}
