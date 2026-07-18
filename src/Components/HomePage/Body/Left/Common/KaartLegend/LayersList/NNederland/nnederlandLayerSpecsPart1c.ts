import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon } from "./nnederlandLayerIcons";

/** Layers 9.7 – 9.9 */
export const nnederlandLayerSpecsPart1c = [
  nnFeatureLayerSpec({
    id: "9.7",
    serviceName: "Vloeistofleidingen",
    title: "Vloestofleidingen",
    icon: nnLineIcon("#1e40af"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.8",
    serviceName: "DataTelecom",
    title: "DataTelecom",
    icon: nnLineIcon("#4ade80"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.9",
    serviceName: "Electrkabels",
    title: "Electrkabels",
    icon: nnLineIcon("#ef4444"),
    regio: [...NN_REGIO],
  }),
];
