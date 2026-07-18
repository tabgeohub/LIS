import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon } from "./nnederlandLayerIcons";

/** Layers 9.10 – 9.11 */
export const nnederlandLayerSpecsPart1d = [
  nnFeatureLayerSpec({
    id: "9.10",
    serviceName: "Gasleidingen",
    title: "Gasleidingen",
    icon: nnLineIcon("#f97316"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.11",
    serviceName: "Primaire_keringen",
    title: "Primaire_keringen",
    icon: nnLineIcon("#22c55e", 7),
    regio: [...NN_MN_REGIO],
  }),
];
