import { LegendLayerDefinition } from "../helpers/layerTypes";
import type { NnLayerSpec } from "./nnederlandLayerSpecEnvelope";

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
