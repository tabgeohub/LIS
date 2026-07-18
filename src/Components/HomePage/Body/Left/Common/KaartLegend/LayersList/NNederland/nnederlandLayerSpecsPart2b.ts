import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon } from "./nnederlandLayerIcons";

/** Layers 9.15 – 9.17 */
export const nnederlandLayerSpecsPart2b = [
  nnFeatureLayerSpec({
    id: "9.15",
    serviceName: "Wadlooproutes",
    title: "Wadlooproutes",
    icon: nnLineIcon("#bbf7d0", 8),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.16",
    serviceName: "Tycomkabel",
    title: "Tycomkabel",
    icon: nnLineIcon("#4ade80"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.17",
    serviceName: "NGTleiding",
    title: "NGTleiding",
    icon: nnLineIcon("#fb923c"),
    regio: [...NN_REGIO],
  }),
];
