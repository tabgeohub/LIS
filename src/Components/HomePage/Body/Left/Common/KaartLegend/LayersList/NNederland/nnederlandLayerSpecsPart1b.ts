import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.4 – 9.6 */
export const nnederlandLayerSpecsPart1b = [
  nnFeatureLayerSpec({
    id: "9.4",
    serviceName: "Strandpalen",
    title: "Strandpalen",
    icon: nnederlandLayerIcons.strandpalen,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.5",
    serviceName: "Damnummers",
    title: "Damnummers",
    icon: nnederlandLayerIcons.damnummers,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.6",
    serviceName: "Lozingspunten",
    title: "Lozingspunten",
    icon: nnederlandLayerIcons.lozingspunten,
    regio: [...NN_REGIO],
  }),
];
