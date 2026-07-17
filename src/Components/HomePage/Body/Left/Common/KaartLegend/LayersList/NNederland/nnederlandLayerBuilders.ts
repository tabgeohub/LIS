import { ReactNode } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import {
  nnFeatureLayerUrl,
  nnLayerSpec,
  type NnLayerSpec,
} from "./nnederlandLayerSpecEnvelope";

export { NNEDERLAND_EU_SERVICES } from "./nnederlandLayerSpecEnvelope";
export { toLegendLayerDefinitions } from "./nnederlandLegendDefinitions";

export function nnFeatureLayerSpec(input: {
  id: string;
  serviceName: string;
  title: string;
  icon: ReactNode;
  regio?: string[];
}): NnLayerSpec {
  return nnLayerSpec({
    id: input.id,
    title: input.title,
    icon: input.icon,
    regio: input.regio,
    layer: new FeatureLayer({
      url: nnFeatureLayerUrl(input.serviceName),
      title: input.title,
    }),
  });
}

export function nnMapImageLayerSpec(input: {
  id: string;
  url: string;
  title: string;
  icon: ReactNode;
  regio?: string[];
}): NnLayerSpec {
  return nnLayerSpec({
    id: input.id,
    title: input.title,
    icon: input.icon,
    regio: input.regio,
    layer: new MapImageLayer({
      url: input.url,
      title: input.title,
    }),
  });
}
