import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.1 – 9.3 */
export const nnederlandLayerSpecsPart1a = [
  nnFeatureLayerSpec({
    id: "9.1",
    serviceName: "Betonning_Totaal",
    title: "Betonning Totaal",
    icon: nnederlandLayerIcons.betonning,
    regio: [...NN_MN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.2",
    serviceName: "ARZ",
    title: "ARZ",
    icon: nnederlandLayerIcons.arz,
  }),
  nnFeatureLayerSpec({
    id: "9.3",
    serviceName: "Strandpaviljoens",
    title: "Strandpaviljoens",
    icon: nnederlandLayerIcons.strandpaviljoens,
    regio: [...NN_REGIO],
  }),
];
