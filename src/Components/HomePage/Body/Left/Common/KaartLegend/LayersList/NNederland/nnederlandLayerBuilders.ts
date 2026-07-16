import { ReactNode } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import { LegendLayerDefinition } from "../helpers/layerTypes";

export const NNEDERLAND_EU_SERVICES =
  "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services";

type NnLayerSpec = {
  id: string;
  title: string;
  icon: ReactNode;
  regio?: string[];
  layer: FeatureLayer | MapImageLayer;
};

function nnLayerSpec(input: Omit<NnLayerSpec, "layer"> & {
  layer: NnLayerSpec["layer"];
}): NnLayerSpec {
  return {
    id: input.id,
    title: input.title,
    icon: input.icon,
    regio: input.regio,
    layer: input.layer,
  };
}

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
      url: `${NNEDERLAND_EU_SERVICES}/${input.serviceName}/FeatureServer`,
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

export function toLegendLayerDefinitions(
  specs: NnLayerSpec[]
): LegendLayerDefinition[] {
  return specs.map((spec) => ({
    id: spec.id,
    title: spec.title,
    layer: spec.layer,
    checked: false,
    icon: spec.icon,
    ...(spec.regio ? { regio: spec.regio } : {}),
  }));
}
