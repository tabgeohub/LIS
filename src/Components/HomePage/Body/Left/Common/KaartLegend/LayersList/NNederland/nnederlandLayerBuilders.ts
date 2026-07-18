import type { ReactNode } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import {
  nnFeatureLayerUrl,
  nnLayerSpec,
  type NnLayerSpec,
} from "./nnederlandLayerSpecEnvelope";

export { NNEDERLAND_EU_SERVICES } from "./nnederlandLayerSpecEnvelope";
export { toLegendLayerDefinitions } from "./nnederlandLegendDefinitions";

type NnLayerMeta = {
  id: string;
  title: string;
  icon: ReactNode;
  regio?: string[];
};

function wrapNnLayerSpec(
  meta: NnLayerMeta,
  layer: FeatureLayer | MapImageLayer
): NnLayerSpec {
  return nnLayerSpec({
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    regio: meta.regio,
    layer,
  });
}

export function nnFeatureLayerSpec(
  input: NnLayerMeta & { serviceName: string }
): NnLayerSpec {
  return wrapNnLayerSpec(
    input,
    new FeatureLayer({
      url: nnFeatureLayerUrl(input.serviceName),
      title: input.title,
    })
  );
}

export function nnMapImageLayerSpec(
  input: NnLayerMeta & { url: string }
): NnLayerSpec {
  return wrapNnLayerSpec(
    input,
    new MapImageLayer({
      url: input.url,
      title: input.title,
    })
  );
}
