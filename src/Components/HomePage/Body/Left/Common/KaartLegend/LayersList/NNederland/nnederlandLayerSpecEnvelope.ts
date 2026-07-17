import { ReactNode } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

export const NNEDERLAND_EU_SERVICES =
  "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services";

export type NnLayerSpec = {
  id: string;
  title: string;
  icon: ReactNode;
  regio?: string[];
  layer: FeatureLayer | MapImageLayer;
};

export function nnLayerSpec(
  input: Omit<NnLayerSpec, "layer"> & { layer: NnLayerSpec["layer"] }
): NnLayerSpec {
  return {
    id: input.id,
    title: input.title,
    icon: input.icon,
    regio: input.regio,
    layer: input.layer,
  };
}

export function nnFeatureLayerUrl(serviceName: string) {
  return `${NNEDERLAND_EU_SERVICES}/${serviceName}/FeatureServer`;
}
