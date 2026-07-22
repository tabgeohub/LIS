import { LegendLayerDefinition } from "../helpers/layerTypes";

/** Shared layout props for LegendSection model → layout mapping. */
export type LegendSectionLayoutProps = {
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
  layers: LegendLayerDefinition[];
};

export type LegendSectionLayoutSource = Omit<
  LegendSectionLayoutProps,
  "layers"
> & {
  filteredLayers: LegendLayerDefinition[];
};

export function toLegendSectionLayoutProps(
  input: LegendSectionLayoutSource
): LegendSectionLayoutProps {
  const { filteredLayers, ...fields } = input;
  return { ...fields, layers: filteredLayers };
}
