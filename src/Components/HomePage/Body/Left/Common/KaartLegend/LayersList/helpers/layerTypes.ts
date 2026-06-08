import { ReactNode } from "react";

export type LegendLayerDefinition = {
  id: string;
  title: string;
  layer: __esri.Layer | __esri.FeatureLayer | __esri.MapImageLayer | null;
  checked: boolean;
  icon?: ReactNode;
  regio?: string[];
};
